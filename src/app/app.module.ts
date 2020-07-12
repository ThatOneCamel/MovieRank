import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { SelectorBtnComponent } from './selector-btn/selector-btn.component';
import { HeaderComponent } from './header/header.component';
import { InputComponent } from './input/input.component';
import { RankViewComponent } from './rank-view/rank-view.component';
import { MovieEditComponent } from './movie-edit/movie-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    SelectorBtnComponent,
    HeaderComponent,
    InputComponent,
    RankViewComponent,
    MovieEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HammerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
