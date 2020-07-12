import { Component, OnInit, Input } from '@angular/core';
import { MovieListService } from '../movie-list.service';
import { Movie } from '../movie';
import * as MovieManager from '../rating/movie-manager';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() item: string = '';
  list: Movie[] = [];
  counter: number = 0;

  constructor() { }

  onEnter(val: string): void {
    this.list.push({id: this.counter, title: val});
    this.counter++;
    this.clear();
  }

  displayList(): string {
    return MovieManager.getMovieTitles(this.list).join(' | ');
  }

  passList(): void {
    console.log("List contained:");
    console.log(this.list);
  }

  clear(): void {
    this.item = '';
  }

  clearList(): void {
    this.list = [];
  }

  ngOnInit(): void {
  }

}
