import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../movie';
import { MOVIES } from '../mock-movies';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-movie-edit',
  templateUrl: './movie-edit.component.html',
  styleUrls: ['./movie-edit.component.css']
})
export class MovieEditComponent implements OnInit {

  @Input() movies: Movie[] = [];
  edit: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  editTitle(movie: Movie, val: string){
    if(val == ""){
      this.delete(movie);
    } else {
      movie.title = val;
    }

  }

  delete(movie: Movie){
    this.movies.splice(this.movies.indexOf(movie), 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

}
