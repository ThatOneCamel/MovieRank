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
  ranked: Movie[] = [];
  likes: Movie[] = [];
  winner: number;
  winningMovie: Movie;

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

  }

  getRandMovie(): Movie{
      return this.movies[Math.floor(Math.random() * this.movies.length)];
  }

  //Adds movies to 'likes' list
  addToLikes(title: string, id: number) {
    let pos = MovieManager.getIndexOfTitle(this.movies, title);
    this.likes.push(this.movies[pos]);
  }

  getNextTitle(oldTitle: Movie, id: number): Movie {    
    if(this.movies.length == 0){
      return {id: 0, title: "Emptiness"};

    } else {
      return this.getRandMovie();

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
