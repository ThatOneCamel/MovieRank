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
  mid = Math.ceil(this.movies.length / 2);
  halfA = [];
  halfB = []


  @Output() emitter = new EventEmitter<any>();

  /*updateMovies(): Observable<Movie[]>{
    return of(MOVIES);
  }*/

  notify(): void {
    this.emitter.emit("GO");
  }

  checkID(id: number): boolean{
    return id == 1 ? true : false;

  }

  //User can manually add a movie
  add(movie: Movie){
    this.movies.push(movie);
  }

  random(movies: Movie[]): Movie {
    let rand = Math.floor(Math.random() * movies.length);
    let movie = movies[rand];
    movies.splice(rand, 1);
    return movie;

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

    let pos = movieList.map(function(e) {
      return e.title;
    }).indexOf(title);

    this.preffered.push(movieList[pos]);
  }

  getNextTitle(oldTitle: string, id: number): string {

    if(this.checkID(id)){
      var movieList = this.halfA;
    } else {
      var movieList = this.halfB;
    }

    let pos = movieList.map(function(e) {
      return e.title;
    }).indexOf(oldTitle);

    movieList.splice(pos, 1);

    let length = movieList.length;
    console.log(length);

    if(length == 0){
      return "";

    } else {
      let rand = Math.floor(Math.random() * movieList.length);
      let title = movieList[rand].title;
      //this.movies.splice(rand, 1);
      //console.log("HALF A AFTER POP HAS " + this.halfA.length);
      //console.log("HALF B AFTER POP HAS " + this.halfB.length);

      return title;

    }

  }

  clear(){
    this.movies = [];
  }

  constructor() {
    var movies = MOVIES;
    let length = movies.length;
    console.log("Mid is " + this.mid)
    while(this.halfA.length != this.mid){
      this.halfA.push(this.random(movies));
    }

    while(this.halfB.length != length - this.mid){
      this.halfB.push(this.random(movies));
    }

    while(this.halfA.length > this.halfB.length){
      this.halfB.push(this.halfA[Math.floor(Math.random() * this.halfA.length)])
    }

    /*console.log("Half A: ");
    console.log(this.halfA);
    console.log("Half B: ");
    console.log(this.halfB);*/

  }
}
