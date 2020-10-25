import { Injectable, Output, EventEmitter } from '@angular/core';
import { Movie } from './movie';
import { MOVIES } from './mock-movies';
import * as MovieManager from './rating/movie-manager';
import { getRatingDelta, getNewRating } from './rating/elo';

@Injectable({
  providedIn: 'root'
})
export class MovieListService {
  movies: Movie[] = [];
  unranked: Movie[] =[];
  ranked: Movie[] = [];
  likes: Movie[] = [];
  finishedRanking: boolean = false;
  winner: number;
  winningMovie: Movie;
  len: number;

  numOfCols: number = 5;

  @Output() emitter = new EventEmitter<any>();

  //Sets winning movie and calls updateMovie() in Card-Component
  notify(winner: number, movie: Movie): void {
    this.winner = winner;
    this.winningMovie = movie;
    this.emitter.emit();
  }

  //User can manually add a movie
  add(movie: Movie){
    this.movies.push(movie);
  }

  setMovies(list: Movie[]): void {
    this.movies = list;
    this.movies.forEach(val => this.unranked.push(Object.assign({}, val)));
    this.len = this.movies.length;
    MovieManager.initElo(this.movies);
    console.log("Finished setting up movies/unranked " + this.len);

  }

  getRandMovie(): Movie{
      return this.movies[Math.floor(Math.random() * this.movies.length)];
  }

  //Adds movies to 'likes' list
  addToLikes(title: string, id: number) {
    let pos = MovieManager.getIndexOfTitle(this.movies, title);
    this.likes.push(this.movies[pos]);
  }

  getNextTitle(): Movie {
    try {
      this.finishedRanking = false;
      console.log("POPPED")
      let x = this.unranked.pop();
      console.log(x)
      return x;
      //return this.unranked.pop();
    } catch (error) {
      return error;
    }
    /*console.log("Unranked:") 
    console.log(this.unranked) 
    console.log("Regular:") 
    console.log(this.movies) */
  }

  getGridTitle(row: number, i: number): Movie {
    if(row == this.len / 5){
      return this.movies[i];
    } else {
      console.log(row);
      console.log("Returning movie: " + (this.len - (5 * row) + i))
      console.log("Should be: " + 5);
      console.log("Row was " + row);
      console.log("i = " + i);
      return this.movies[this.len - (5 * row) + i]
    }
  }

  getMovies(): Movie[] {
    return this.movies;
  }

  acceptDefeat(id: number, loser: Movie){
    MovieManager.adjustElo(this.winningMovie, loser);
    console.log(this.movies);
    MovieManager.sortByElo(this.movies);
  }

  clear(){
    this.movies = [];
  }

  constructor() { }
}
