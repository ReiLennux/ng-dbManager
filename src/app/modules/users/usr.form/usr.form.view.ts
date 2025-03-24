import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsrService } from '../../../core/services/usr.service';
import { DbsService } from '../../../core/services/dbs.service';

@Component({
  selector: 'app-usr-form',
  standalone: false,
  templateUrl: './usr.form.view.html',
})
export class UsrFormView implements OnInit {
  usrForm: FormGroup;
  roles: string[] = [
    'db_owner', 'db_securityadmin', 'db_accessadmin', 'db_backupoperator',
    'db_datareader', 'db_datawriter', 'db_ddladmin'
  ];
  selectedRoles: string[] = [];
  databases: string[] = [];
  schemas: string[] = [];
  tables: { SchemaName: string, TableName: string }[] = [];
  success: boolean = false;
  failure: boolean = false;
  failureMessagge: string = "";


  // Permisos
  schemaPermissionsList: string[] = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
  tablePermissionsList: string[] = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
  selectedSchemaPerms: { [schema: string]: string[] } = {};
  selectedTablePerms: { [table: string]: string[] } = {};
  schemaPermsString: string = '';
  tablePermsString: string = '';

  constructor(private fb: FormBuilder, private dbService: DbsService, private usrService: UsrService) {
    this.usrForm = this.fb.group({
      databaseName: ['', Validators.required],
      LoginName: ['', Validators.required],
      UserName: ['', Validators.required],
      Password: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(8), this.passwordComplexityValidator()]],
      SchemaPerms: ['', Validators.required],
      TablePerms: ['',],
      RoleList: [[]],
    });
  }

  ngOnInit(): void {
    this.getDatabases();
  }

  private getDatabases(): void {
    this.dbService.getDbs().subscribe(dbs => this.databases = dbs.map(db => db.database_name));
  }

  onselectedDatabases(): void {
    const dbName = this.usrForm.get('databaseName')?.value;
    this.dbService.getSchemas(dbName).subscribe(schemas => this.schemas = schemas.map(schema => schema.SchemaName));
    this.dbService.getTables(dbName).subscribe(tables => this.tables = tables.map(table => ({ SchemaName: table.SchemaName, TableName: table.TableName })));
  }

  onSubmit(): void {
    if (this.usrForm.valid) {
      this.usrForm.patchValue({
        RoleList: this.selectedRoles.join(','),
        SchemaPerms: this.schemaPermsString,
        TablePerms: this.tablePermsString
      });
      
      console.log(this.usrForm.value);
  
      this.usrService.createUser(this.usrForm.value).subscribe({
        next: (res) => {
          console.log(res);
  
          // Manejo del código de respuesta del SP
          switch (res) {
            case 0:
              // Éxito
              this.success = true;
              this.resetForm();
              setTimeout(() => this.success = false, 5000);
              break;
            case 1:
              // Error general
              this.failure = true;
              this.failureMessagge = "Ocurrió un error inesperado";
              setTimeout(() => this.failure = false, 5000);
              break;
            case 2:
              // El login ya existe
              this.failure = true;
              this.failureMessagge = "Este login ya existe en el servidor"; 
              setTimeout(() => this.failure = false, 5000);
              break;
            case 3:
              // El usuario ya existe
              this.failure = true;
              this.failureMessagge = "Este usuario ya existe en la base de datos";
              setTimeout(() => this.failure = false, 5000);
              break;
            case 6:
              // Error en el formato de permisos de esquemas
              this.failure = true;
              this.failureMessagge = "Los permisos del esquema no son los correctos";
              setTimeout(() => this.failure = false, 5000);
              break;
            case 7:
              // Error en el formato de permisos de tablas
              this.failure = true;
              this.failureMessagge = "Los permisos de la(s) tabla(s) no son los correctos";
              setTimeout(() => this.failure = false, 5000);
              break;
            default:
              // Otro error desconocido
              this.failure = true;
              this.failureMessagge = `Ocurrió un error inesperado (Código: ${res}).`;
              setTimeout(() => this.failure = false, 5000);
              break;
          }
        },
        error: (err) => {
          console.error(err);
          this.failureMessagge = "An unexpected error occurred.";
        }
      });
    } else {
      this.markFormGroupTouched(this.usrForm);
    }
  }
  

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm(): void {
    this.usrForm.reset();
    this.selectedRoles = [];
    this.selectedSchemaPerms = {};
    this.selectedTablePerms = {};
    this.schemaPermsString = '';
    this.tablePermsString = '';
  }


  toggleRole(role: string): void {
    this.selectedRoles.includes(role) 
      ? this.selectedRoles = this.selectedRoles.filter(r => r !== role)
      : this.selectedRoles.push(role);
  }

  isRoleSelected(role: string): boolean {
    return this.selectedRoles.includes(role);
  }

  toggleSchemaPermission(schema: string, perm: string, event: any): void {
    if (!this.selectedSchemaPerms[schema]) this.selectedSchemaPerms[schema] = [];
    event.target.checked
      ? this.selectedSchemaPerms[schema].push(perm)
      : this.selectedSchemaPerms[schema] = this.selectedSchemaPerms[schema].filter(p => p !== perm);
    
    this.updatePermisosString();
  }

  toggleTablePermission(table: { TableName: string, SchemaName: string }, perm: string, event: any): void {
    const key = `${table.SchemaName}.${table.TableName}`;
    if (!this.selectedTablePerms[key]) this.selectedTablePerms[key] = [];
    event.target.checked
      ? this.selectedTablePerms[key].push(perm)
      : this.selectedTablePerms[key] = this.selectedTablePerms[key].filter(p => p !== perm);
    
    this.updatePermisosString();
  }

  updatePermisosString(): void {
    this.schemaPermsString = Object.entries(this.selectedSchemaPerms)
      .map(([schema, perms]) => perms.map(p => `${schema}:${p}`).join(';'))
      .filter(str => str.length > 0)
      .join(';');

    this.tablePermsString = Object.entries(this.selectedTablePerms)
      .map(([table, perms]) => perms.map(p => `${table}:${p}`).join(';'))
      .filter(str => str.length > 0)
      .join(';');

    this.usrForm.patchValue({ 
      SchemaPerms: this.schemaPermsString, 
      TablePerms: this.tablePermsString 
    });
  }

    // Función para validar la complejidad de la contraseña
    passwordComplexityValidator() {
      return (control: AbstractControl) => {
        const password = control.value;
        if (!password) {
          return null;
        }
    
        const minLengthValid = password.length >= 8;
        const uppercaseValid = /[A-Z]/.test(password);
        const lowercaseValid = /[a-z]/.test(password);
        const digitValid = /\d/.test(password);
        const symbolValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
        const charTypesCount = [uppercaseValid, lowercaseValid, digitValid, symbolValid].filter(Boolean).length;
    
        if (minLengthValid && charTypesCount >= 3) {
          return null;
        } else {
          return { passwordTooSimple: true };  // <-- Esto está correcto
        }
      };
    }
  
    // Método para verificar si el campo está inválido
    isFieldInvalid(field: string) {
      return this.usrForm.controls[field].invalid && (this.usrForm.controls[field].touched || this.usrForm.controls[field].dirty);
    }
  
    // Método para verificar si la contraseña es demasiado simple
    passwordTooSimple() {
      return this.usrForm.controls['Password'].hasError('passwordTooSimple');
    }
}
