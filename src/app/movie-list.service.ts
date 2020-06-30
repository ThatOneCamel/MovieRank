import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie } from './movie';
import { MOVIES } from './mock-movies';

@Injectable({
  providedIn: 'root'
})
export class MovieListService {
  movies: Movie[] = MOVIES;
  preffered: Movie[] = [];

  @Output() emitter = new EventEmitter<any>();

  /*updateMovies(): Observable<Movie[]>{
    return of(MOVIES);
  }*/

  notify(): void {
    this.emitter.emit("GO");
  }

  //User can manually add a movie
  add(movie: Movie){
    this.movies.push(movie);
  }

  getRand(): string{
    return this.movies[Math.floor(Math.random() * this.movies.length)].title;
  }

  popTitle(oldTitle: string): string {

    let pos = this.movies.map(function(e) {
      return e.title;
    }).indexOf(oldTitle);

    this.preffered.push(this.movies[pos]);

    this.movies.splice(pos, 1);

    return this.getNextTitle();
  }

  getNextTitle(): string {
    let length = this.movies.length;
    console.log(length);

    if(length == 0){
      alert("No more movies to sift through");
      console.log("You seem to really like:");
      console.log(this.preffered);
      return "";

    } else {
      let rand = Math.floor(Math.random() * this.movies.length);
      let title = this.movies[rand].title;
      //this.movies.splice(rand, 1);
      return title;

    }

  }

  clear(){
    this.movies = [];
  }

  constructor() { }
}
