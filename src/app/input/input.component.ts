import { Component, OnInit, Input } from '@angular/core';
import { MovieListService } from '../movie-list.service';
import { Movie } from '../movie';

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

  passList(): void {
    console.log("List contained:");
    console.log(this.list);
    //this.movieService.movies = this.list;
  }

  clear(): void {
    this.item = '';
  }

  ngOnInit(): void {
  }

}
