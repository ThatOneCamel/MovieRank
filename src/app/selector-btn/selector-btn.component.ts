import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-selector-btn',
  templateUrl: './selector-btn.component.html',
  styleUrls: ['./selector-btn.component.css']
})
export class SelectorBtnComponent implements OnInit {
  @Input() movie: number;
  //mobile: boolean;
  //Web Arrow Directions [Row oriented]
  srcA = "assets/btn_images/arr_left.png";
  srcB = "assets/btn_images/arr_right.png";

  //Mobile Arrow Directions [Col oriented]
  srcC = "assets/btn_images/arr_up.png";
  srcD = "assets/btn_images/arr_down.png";

  //Like Button
  srcH = "assets/btn_images/heart.svg";

  constructor() { }
  onCilck(movieChoice: number): void{
    //console.log("Movie number " + movieChoice + " was chosen")
  }

  ngOnInit(): void {
    //this.mobile = false;
  }

}
