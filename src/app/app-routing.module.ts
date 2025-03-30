import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbsMainView } from './modules/MSSQL/dbs/dbs.main/dbs.main.view';
import { DbsFormView } from './modules/MSSQL/dbs/dbs.form/dbs.form.view';
import { UsrMainView } from './modules/MSSQL/users/usr.main/usr.main.view';
import { UsrFormView } from './modules/MSSQL/users/usr.form/usr.form.view';
import { BackupMainView } from './modules/MSSQL/backups/backup.main/backup.main.view';
import { BackupFormView } from './modules/MSSQL/backups/backup.form/backup.form.view';

const routes: Routes = [
  { path: '', component: DbsMainView },
  { path: 'dbs', component: DbsMainView },
  { path: 'dbs/create', component: DbsFormView },
  { path: 'dbs/:id', component: DbsFormView },
  { path: 'users', component: UsrMainView },
  { path: 'users/create', component: UsrFormView },
  { path: 'users/:id', component: UsrFormView },
  { path: 'backups', component: BackupMainView },
  { path: 'backups/create', component: BackupFormView },
  { path: 'backups/:id', component: BackupFormView },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
