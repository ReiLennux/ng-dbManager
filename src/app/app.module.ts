import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './layout/app.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { DbsMainView } from './modules/MSSQL/dbs/dbs.main/dbs.main.view';
import { DbsFormView } from './modules/MSSQL/dbs/dbs.form/dbs.form.view';
import { UsrFormView } from './modules/MSSQL/users/usr.form/usr.form.view';
import { UsrMainView } from './modules/MSSQL/users/usr.main/usr.main.view';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BackupMainView } from './modules/MSSQL/backups/backup.main/backup.main.view';
import { BackupFormView } from './modules/MSSQL/backups/backup.form/backup.form.view';
import { BackupsFormView } from './modules/Mongo/backups/backups.form/backups.form.view';
import { BackupsMainView } from './modules/Mongo/backups/backups.main/backups.main.view';
import { UsersFormView } from './modules/Mongo/users/users.form/users.form.view';
import { UsersMainView } from './modules/Mongo/users/users.main/users.main.view';
import { ImpexpMainView } from './modules/Mongo/impexp/impexp.main/impexp.main.view';
import { ImpexpFormView } from './modules/Mongo/impexp/impexp.form/impexp.form.view';
import { CrudFormView } from './modules/Mongo/crud/crud.form/crud.form.view';
import { CrudMainView } from './modules/Mongo/crud/crud.main/crud.main.view';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DbsMainView,
    DbsFormView,
    UsrFormView,
    UsrMainView,
    BackupMainView,
    BackupFormView,
    BackupsFormView,
    BackupsMainView,
    UsersFormView,
    UsersMainView,
    ImpexpMainView,
    ImpexpFormView,
    CrudFormView,
    CrudMainView
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
