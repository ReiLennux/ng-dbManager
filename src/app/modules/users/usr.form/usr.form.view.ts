import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsrService } from '../../../core/services/usr.service';
import { DbsService } from '../../../core/services/dbs.service';

@Component({
  selector: 'app-usr-form',
  standalone: false,
  templateUrl: './usr.form.view.html',
})
export class UsrFormView implements OnInit {
  usrForm: FormGroup;
  roles: string[] = ['db_owner', 'db_securityadmin', 'db_accessadmin', 'db_backupoperator', 'db_datareader', 'db_datawriter', 'db_ddladmin', 'db_executor'];
  selectedRoles: string[] = [];
  databases: string[] = [];
  schemas: string[] = [];
  tables: { SchemaName: string, TableName: string }[] = [];
  success: boolean = false;

  constructor(private fb: FormBuilder, private dbService: DbsService, private usrService: UsrService) {
    this.usrForm = this.fb.group({
      databaseName: ['', Validators.required],
      LoginName: ['', Validators.required],
      UserName: ['', Validators.required],
      Password: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
      SchemaPerms: ['', Validators.required],
      TablePerms: ['', Validators.required],
      RoleList: [[]], // Almacena los roles seleccionados como un array
    });
  }

  ngOnInit(): void {
    this.getDatabases();
  }


  onselectedDatabases(): void {
    this.dbService.getSchemas(this.usrForm.get('databaseName')?.value).subscribe(schemas => this.schemas = schemas.map(schema => schema.SchemaName));
    console.log(this.schemas);
    this.dbService.getTables(this.usrForm.get('databaseName')?.value).subscribe(tables => this.tables = tables.map(table => ({ SchemaName: table.SchemaName, TableName: table.TableName })));
    console.log(this.tables);
  }

  private getDatabases(): void {
    this.dbService.getDbs().subscribe(dbs => this.databases = dbs.map(db => db.database_name));
  }

  onSubmit(): void {
    if (this.usrForm.valid) {
      // Convertir los roles seleccionados en una cadena separada por comas
      const roleListString = this.selectedRoles.join(',');

      // Actualizar el formulario con la cadena en lugar del array
      this.usrForm.patchValue({ RoleList: roleListString });

      console.log(this.usrForm.value);

      // Enviar los datos al servicio
      this.usrService.createUser(this.usrForm.value).subscribe(res => console.log(res));

      this.success = true;
      // Resetear el formulario
      this.resetForm();
      setInterval(() =>
        this.success = false,
        5000 // Tiempo en milisegundos
      );
    } else {
      this.markFormGroupTouched(this.usrForm);
    }
  }


  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm() {
    this.usrForm.reset();
    this.selectedRoles = [];
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.usrForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  toggleRole(role: string) {
    if (this.selectedRoles.includes(role)) {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    } else {
      this.selectedRoles.push(role);
    }
  }

  isRoleSelected(role: string): boolean {
    return this.selectedRoles.includes(role);
  }
}
