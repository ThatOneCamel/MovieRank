import { Injectable, Output, EventEmitter } from '@angular/core';
import { Movie } from './movie';
import { MOVIES } from './mock-movies';
import * as MovieManager from './rating/movie-manager';
import { getRatingDelta, getNewRating } from './rating/elo';
import { from } from 'rxjs';
import { CardComponent } from './card/card.component';

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
  poppedMovie: Movie;
  gridTitle: Movie;
  card_a: CardComponent;
  card_b: CardComponent;
  lastBeat: Movie;

  numOfCols: number = 5;

  @Output() emitter = new EventEmitter<any>();

  //Sets winning movie and calls updateMovie() in Card-Component
  notify(winner: number, movie: Movie): void {
    this.winner = winner;
    this.winningMovie = movie;
    //this.emitter.emit();
  }

  //User can manually add a movie
  add(movie: Movie){
    this.movies.push(movie);
  }

  setMovies(list: Movie[]): void {
    this.movies = list;
    this.movies.forEach(val => this.unranked.push(Object.assign({}, val)));
    //console.log(this.movies)
    //console.log(this.unranked)

    this.len = this.movies.length;
    //MovieManager.initElo(this.movies);
    ////console.log("Finished setting up movies/unranked " + this.len);

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
      ////console.log("POPPED");
      let x = this.unranked.pop();
      this.poppedMovie = x;
      //console.log("Len of unranked: " + this.unranked.length);
      return x;
      //return this.unranked.pop();
    } catch (error) {
      return error;
    }
    /*//console.log("Unranked:") 
    //console.log(this.unranked) 
    //console.log("Regular:") 
    //console.log(this.movies) */
  }

  getNextTitleNoMod(): Movie {
    try{
      return this.unranked[this.unranked.length - 1];
    } catch (error){
      return error;
    }
    
  }

  arraymove(fromIndex: number, toIndex: number) {
    var element = this.movies[fromIndex];
    this.movies.splice(fromIndex, 1);
    //console.log("MOVED " + element.title);
    //console.log("From: " + fromIndex);
    //console.log("To: " + toIndex);
    this.movies.splice(toIndex, 0, element);
    //console.log(this.movies);

  }

  getGridTitle(row: number, i: number): Movie {
    let MAX_ROW = Math.ceil(this.len / 5);
    ////console.log("row = " + row + " --- i = " + i)
    if(row == MAX_ROW){
      //console.log(row + "   " + i);
      ////console.log("Returning grid title immediately [" + i + "]")
      ////console.log(this.movies[i].title)
      this.gridTitle = this.movies[i];
      ////console.log(this.movies)
      return this.movies[i];
    } else {
      //console.log(row + "   " + i);
      ////console.log("Returning movie: " + (this.len - (5 * row) + i))
      ////console.log("Should be: " + 5);
      ////console.log("Row was " + row);
      ////console.log("i = " + i);
      this.gridTitle = this.movies[this.len - (5 * row) + i];
      return this.movies[this.len - (5 * row) + i]
    }
  }

  getMovies(): Movie[] {
    return this.movies;
  }

  acceptDefeat(id: number, loser: Movie){
    //MovieManager.adjustElo(this.winningMovie, loser);
    ////console.log(this.movies);
    //MovieManager.sortByElo(this.movies);
  }

  clear(){
    this.movies = [];
  }

  constructor() { }
}
