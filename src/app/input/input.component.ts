import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() item: string = '';
  list: string[] = [];

  constructor() { }

  onEnter(val: string): void {
    this.list.push(val);
    console.log(this.list);
    this.clear();
  }

  clear(): void {
    this.item = '';
  }

  ngOnInit(): void {
  }

}
