import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbsMainView } from './modules/dbs/dbs.main/dbs.main.view';
import { DbsFormView } from './modules/dbs/dbs.form/dbs.form.view';
import { UsrMainView } from './modules/users/usr.main/usr.main.view';
import { UsrFormView } from './modules/users/usr.form/usr.form.view';

const routes: Routes = [
  { path: '', component: DbsMainView },
  { path: 'dbs', component: DbsMainView },
  { path: 'dbs/create', component: DbsFormView },
  { path: 'dbs/:id', component: DbsFormView },
  { path: 'users', component: UsrMainView },
  { path: 'users/create', component: UsrFormView },
  { path: 'users/:id', component: UsrFormView },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
