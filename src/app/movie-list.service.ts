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
  finalRanks: Movie[] = [];
  unranked: Movie[] = [];
  likes: Movie[] = [];
  winner: number;
  winningMovie: Movie;
  len: number;

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
    MovieManager.initElo(this.movies);
    this.len = this.movies.length;

  }

  getRandMovie(): Movie{
      return this.movies[Math.floor(Math.random() * this.movies.length)];
  }

  //Adds movies to 'likes' list
  addToLikes(title: string, id: number) {
    let pos = MovieManager.getIndexOfTitle(this.movies, title);
    this.likes.push(this.movies[pos]);
  }

  getNextTitle(prev: Movie, id: number): Movie {    
    if(this.movies.length == 0 || this.finalRanks.length == this.len){
      alert("Stop.");
      return {id: -1, title: "Finished"};

    } /*else {
      //If loser is not ranked, move it to unranked and remove it from general pop
      if(prev.ranked != true){
        console.log(prev.title + " is Unranked.");
        this.unranked.push(prev);
        this.movies.splice(this.movies.indexOf(prev), 1);

      }


      console.log(this.movies);
      console.log(this.unranked);
      //If there is 1 movie in gen pop AND unranked has some other element
      if(this.movies.length < 2 && this.unranked.length > 0){
        return this.unranked[0];

        //If unranked is empty, all movies are ranked
      } else if(this.movies.length == 1){
        this.resetList(prev);
      } else if(this.unranked.length == 0) {
        return {id: -1, title: "Finished, Unranked = 0"};

        //If all movies in gen pop have been ranked, restart until everything gets into finalRanked
      } else if (MovieManager.allRanked(this.movies)) {
        this.resetList(prev);

        return MovieManager.exposeUnranked(this.movies);
        //Otherwise get a random movie
      } else {
        return MovieManager.exposeUnranked(this.movies);
      }

    }*/

    return this.getRandMovie();

  }

  resetList(prev: Movie){
    this.movies.forEach(movie => {
      this.finalRanks.push(movie);
    });
    if(!this.finalRanks.includes(prev)){
      this.finalRanks.push(prev);
    }
    this.movies = [];
    this.unranked.forEach(movie => (this.movies.push(movie)));
    this.unranked = [];
    this.finalRanks = MovieManager.sortByElo(this.finalRanks);
    console.log("Final Ranks Below");
    console.log(this.finalRanks);
  }

  acceptDefeat(id: number, loser: Movie){
    MovieManager.adjustElo(this.winningMovie, loser);
    MovieManager.sortByElo(this.movies);
  }

  clear(){
    this.movies = [];
  }

  constructor() { }
}
