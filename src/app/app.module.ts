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
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DbsMainView,
    DbsFormView,
    UsrFormView,
    UsrMainView,
    BackupMainView,
    BackupFormView
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
