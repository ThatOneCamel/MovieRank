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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from '@angular/common/http';
import { ArrangeComponent } from './arrange/arrange.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    SelectorBtnComponent,
    HeaderComponent,
    InputComponent,
    RankViewComponent,
    MovieEditComponent,
    ArrangeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
