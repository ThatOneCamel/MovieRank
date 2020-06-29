import { Component, OnInit, Input, Output } from '@angular/core';
import { SelectorBtnComponent } from '../selector-btn/selector-btn.component'
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() title: string;
  @Input() srcStr: string;
  @Input() cardID: number;
  //Selector btn: Selec;

  onClick(): void {
    console.log("Hey you clicked card #" + this.cardID)
  }

  constructor() { }

  ngOnInit(): void {
  }

}
