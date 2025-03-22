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
  roles: string[] = [
    'db_owner', 'db_securityadmin', 'db_accessadmin', 'db_backupoperator',
    'db_datareader', 'db_datawriter', 'db_ddladmin'
  ];
  selectedRoles: string[] = [];
  databases: string[] = [];
  schemas: string[] = [];
  tables: { SchemaName: string, TableName: string }[] = [];
  success: boolean = false;

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
      Password: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
      SchemaPerms: ['', Validators.required],
      TablePerms: ['', Validators.required],
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
      this.usrService.createUser(this.usrForm.value).subscribe(res => console.log(res));

      this.success = true;
      this.resetForm();
      setTimeout(() => this.success = false, 5000);
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.usrForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
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
}
