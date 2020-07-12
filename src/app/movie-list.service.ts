import { Injectable, Output, EventEmitter } from '@angular/core';
import { Movie } from './movie';
import { MOVIES } from './mock-movies';
import * as MovieManager from './rating/movie-manager';
import { getRatingDelta, getNewRating } from './rating/elo';

@Injectable({
  providedIn: 'root'
})
export class MovieListService {
  movies: Movie[] = MOVIES;
  likes: Movie[] = [];
  mid = Math.ceil(this.movies.length / 2);
  winner: number;
  halfA = [];
  halfB = [];

  @Output() emitter = new EventEmitter<any>();

  notify(winner: number): void {
    this.emitter.emit();
    this.winner = winner;
  }

  checkID(id: number): boolean{
    return id == 1 ? true : false;

  }

  //User can manually add a movie
  add(movie: Movie){
    this.movies.push(movie);
  }

  getRandTitle(id: number): string{
    if(this.checkID(id)){
      return this.halfA[Math.floor(Math.random() * this.halfA.length)].title;
    } else {
      return  this.halfB[Math.floor(Math.random() * this.halfB.length)].title;
    }
  }

  addChosenMovie(title: string, id: number) {
    if(this.checkID(id)){
      var movieList = this.halfA;
    } else {
      var movieList = this.halfB;
    }

    let pos = MovieManager.getIndexOfTitle(movieList, title);

    this.likes.push(movieList[pos]);
  }

  getNextTitle(oldTitle: string, id: number): string {
    //Checking which card to update
    if(this.checkID(id)){
      var movieList = this.halfA;
    } else {
      var movieList = this.halfB;
    }

    //Removing old movie out of halfA/halfB array
    let pos = MovieManager.getIndexOfTitle(movieList, oldTitle);
    movieList.splice(pos, 1);
    
    if(movieList.length == 0){
      return "Emptiness";

    } else {
      let title = movieList[0].title;
      return title;

    }

  }

  clear(){
    this.movies = [];
  }

  constructor() {
    this.halfA = this.movies;
    this.halfB = MovieManager.splitMovieArr(this.halfA);

    console.log("Half A: ");
    console.log(this.halfA);
    console.log("Half B: ");
    console.log(this.halfB);

  }
}
