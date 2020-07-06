import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from '../app/header/header.component'
import { InputComponent } from '../app/input/input.component'
import { RankViewComponent } from './rank-view/rank-view.component';


const routes: Routes = [
  { path: '', component: HeaderComponent },
  { path: 'makelist', component: InputComponent },
  { path: 'rank', component: RankViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
