import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from '../app/header/header.component'
import { InputComponent } from '../app/input/input.component'


const routes: Routes = [
  { path: '', component: HeaderComponent },
  { path: 'makelist', component: InputComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
