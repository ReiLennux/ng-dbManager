import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbsService } from '../../../../core/services/Mongo/dbs.service';
import { UsrsService } from '../../../../core/services/Mongo/usrs.service';

@Component({
  selector: 'app-users.form',
  standalone: false,
  templateUrl: './users.form.view.html',
})
export class UsersFormView implements OnInit {
  usrForm: FormGroup;
  
  // Roles básicos por base de datos
  roles: string[] = ['read', 'readWrite', 'dbAdmin', 'dbOwner', 'userAdmin'];

  // Roles avanzados (globales, asignados a la DB "admin")
  advancedRoles: string[] = [
    'clusterAdmin', 'clusterManager', 'clusterMonitor', 'hostManager',
    'backup', 'restore', 'readAnyDatabase', 'readWriteAnyDatabase',
    'userAdminAnyDatabase', 'dbAdminAnyDatabase', 'root'
  ];

  databases: any[] = [];
  success: boolean = false;
  failure: boolean = false;
  failureMessagge: string = '';
  showAdvancedRoles: boolean = false;

  // Permisos seleccionados por base de datos
  rolesSelected: { [db: string]: string[] } = {};
  selectedAdvancedRoles: string[] = [];

  constructor(private fb: FormBuilder, private dbService: DbsService, private usrsService: UsrsService) {
    this.usrForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.getDatabases();
  }

  private getDatabases(): void {
    this.dbService.getDatabases().subscribe(dbs => this.databases = dbs);
  }

  onSubmit() {
    const userData = {
      username: this.usrForm.value.username,
      password: this.usrForm.value.password,
      roles: this.getSelectedRoles(), // Se genera la lista de roles correctamente
    };

    this.usrsService.createUser(userData).subscribe(
      res => {
        this.success = true;
        this.failure = false;
        this.failureMessagge = '';
        this.usrForm.reset();
        this.rolesSelected = {};
        this.selectedAdvancedRoles = [];
      },
      err => {
        this.failure = true;
        this.success = false;
        this.failureMessagge = err.error.message;
      }
    );
  }

  isFieldInvalid(field: string) {
    return this.usrForm.controls[field].invalid &&
           (this.usrForm.controls[field].touched || this.usrForm.controls[field].dirty);
  }

  // Maneja los permisos por base de datos
  togglePermission(db: string, perm: string, event: any): void {
    if (!this.rolesSelected[db]) {
      this.rolesSelected[db] = [];
    }

    if (event.target.checked) {
      this.rolesSelected[db].push(perm);
    } else {
      this.rolesSelected[db] = this.rolesSelected[db].filter(p => p !== perm);
    }

    this.updatePermissionsString();
  }

  // Maneja los permisos avanzados (globales, asignados a "admin")
  toggleAdvancedRole(role: string, event: any): void {
    if (event.target.checked) {
      this.selectedAdvancedRoles.push(role);
    } else {
      this.selectedAdvancedRoles = this.selectedAdvancedRoles.filter(r => r !== role);
    }
    this.updatePermissionsString();
  }

  // Formatea los roles en la estructura correcta
  private getSelectedRoles(): { role: string; db: string }[] {
    const rolesArray: { role: string; db: string }[] = [];

    // Agregar permisos por base de datos
    for (const db in this.rolesSelected) {
      this.rolesSelected[db].forEach(role => {
        rolesArray.push({ role, db });
      });
    }

    // Agregar permisos avanzados con la base de datos "admin"
    this.selectedAdvancedRoles.forEach(role => {
      rolesArray.push({ role, db: 'admin' });
    });

    return rolesArray;
  }

  private updatePermissionsString() {
    console.log('Permisos seleccionados:', this.getSelectedRoles());
  }
}
