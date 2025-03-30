import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbsMainView as mssqlDbsMainView } from './modules/MSSQL/dbs/dbs.main/dbs.main.view';
import { DbsFormView as mssqlDbsFormView } from './modules/MSSQL/dbs/dbs.form/dbs.form.view';
import { UsrMainView as mssqlUsrMainView } from './modules/MSSQL/users/usr.main/usr.main.view';
import { UsrFormView as mssqlUsrFormView } from './modules/MSSQL/users/usr.form/usr.form.view';
import { BackupMainView as mssqlBackups } from './modules/MSSQL/backups/backup.main/backup.main.view';
import { BackupFormView as mssqlBackupFormView } from './modules/MSSQL/backups/backup.form/backup.form.view';

import { DbsMainView as mongoDbsMainView } from './modules/Mongo/dbs/dbs.main/dbs.main.view';
import { DbsFormView as mongoDbsFormView } from './modules/Mongo/dbs/dbs.form/dbs.form.view';
import { UsersMainView as mongoUsrMainView } from './modules/Mongo/users/users.main/users.main.view';
import { UsersFormView as mongoUsrFormView } from './modules/Mongo/users/users.form/users.form.view';
import { BackupsMainView as mongoBackups } from './modules/Mongo/backups/backups.main/backups.main.view';
import { BackupsFormView as mongoBackupFormView } from './modules/Mongo/backups/backups.form/backups.form.view';
import { ImpexpFormView } from './modules/Mongo/impexp/impexp.form/impexp.form.view';
import { ImpexpMainView } from './modules/Mongo/impexp/impexp.main/impexp.main.view';
import { CrudFormView } from './modules/Mongo/crud/crud.form/crud.form.view';
import { CrudMainView } from './modules/Mongo/crud/crud.main/crud.main.view';

const routes: Routes = [
  // MSSQL Routes
  { path: '', redirectTo: 'mssql/dbs', pathMatch: 'full' },
  { path: 'mssql/dbs', component: mssqlDbsMainView },
  { path: 'mssql/dbs/create', component: mssqlDbsFormView },
  { path: 'mssql/dbs/:id', component: mssqlDbsFormView },
  { path: 'mssql/users', component: mssqlUsrMainView },
  { path: 'mssql/users/create', component: mssqlUsrFormView },
  { path: 'mssql/users/:id', component: mssqlUsrFormView },
  { path: 'mssql/backups', component: mssqlBackups },
  { path: 'mssql/backups/create', component: mssqlBackupFormView },
  { path: 'mssql/backups/:id', component: mssqlBackupFormView },

  // Mongo Routes
  { path: 'mongo/dbs', component: mongoDbsMainView },
  { path: 'mongo/dbs/create', component: mongoDbsFormView },
  { path: 'mongo/dbs/:id', component: mongoDbsFormView },
  { path: 'mongo/users', component: mongoUsrMainView },
  { path: 'mongo/users/create', component: mongoUsrFormView },
  { path: 'mongo/users/:id', component: mongoUsrFormView },
  { path: 'mongo/backups', component: mongoBackups },
  { path: 'mongo/backups/create', component: mongoBackupFormView },
  { path: 'mongo/backups/:id', component: mongoBackupFormView },
  { path: 'mongo/impexp', component: ImpexpMainView },
  { path: 'mongo/impexp/create', component: ImpexpFormView },
  { path: 'mongo/impexp/:id', component: ImpexpFormView },
  { path: 'mongo/crud', component: CrudMainView },
  { path: 'mongo/crud/create', component: CrudFormView },
  { path: 'mongo/crud/:id', component: CrudFormView },


  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
