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

  constructor(private movieService: MovieListService) { }

  insert(val: string){
    this.list.push({id: this.counter, title: val});
    this.counter++;
  }

  onEnter(val: string): void {
    this.insert(val);
    this.clear();
  }

  onPaste(event: ClipboardEvent): void {
    let pasted = event.clipboardData.getData('text').split(/\r?\n/);
    pasted.forEach(title => { this.insert(title); });
    //This doesn't let the pasted text appear in the input field
    //event.preventDefault();
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    //this.clear();
  }

  displayList(): string {
    return MovieManager.getMovieTitles(this.list).join(' | ');
  }

  passList(): void {
    console.log("List contained:");
    console.log(this.list);
    this.movieService.setMovies(this.list);
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
