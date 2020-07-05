import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() item: string = '';

  constructor() { }

  onEnter(obj: any): void {
    console.log(obj);
    obj = '';
    this.clear();
  }

  clear(): void {
    this.item = '';
  }

  ngOnInit(): void {
  }

}
