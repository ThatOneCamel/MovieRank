import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() title: string;
  @Input() srcStr: string;

  onClick(): void {
    console.log("Hey you clicked a card")
  }

  constructor() { }

  ngOnInit(): void {
  }

}
