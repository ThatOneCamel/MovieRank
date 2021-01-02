import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MovieListService } from '../movie-list.service';
import { Movie } from '../movie';
import { getIndexOfTitle } from '../rating/movie-manager';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MOVIES, MOVIES2, noPosterImg } from '../mock-movies';
import * as MovieManager from '../rating/movie-manager';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-rank-view',
  templateUrl: './rank-view.component.html',
  styleUrls: ['./rank-view.component.css']
})
export class RankViewComponent implements OnInit {
  

  placeholderImg = noPosterImg;
  

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.key == 'ArrowRight'){
      this.movieService.card_b.onClick();
    } else if (event.key == 'ArrowLeft'){
      this.movieService.card_a.onClick();
    }
    //console.log(event.key);
  }

  //movies: Movie[] = MOVIES2;
  movies: Movie[] = [];

  constructor(private router: Router, private movieService: MovieListService) {
    //If page is loaded and there aren't any movies to rank,  go back to makelist
    if(this.movieService.movies.length < 1){
      //this.movieService.setMovies(MOVIES2); //CAN BE USED TO BYPASS REROUTE FOR TESTING
      //alert('No movies were given, redirecting.');
      router.navigate(['makelist']);
    }
    this.movies = this.movieService.getMovies();
    this.displayList();
    //this.movies[2] = {id: 5, title: "Blahhh"}

    //this.movieService


  }

  displayList(): string {
    return MovieManager.getMovieTitles(this.movieService.movies).join(' | ');
  }

  //items: Array<number> = Array.from({ length: 21 }, (v, k) => k + 1);
  // two dimensional table matrix representing view model
  movieTable: Array<Movie[]>;

  // fix column width as defined in CSS (150px + 5px margin)
  boxWidth = 150;
  // calculated based on dynamic row width
  columnSize: number;

  getItemsTable(rowLayout: Element): Movie[][] {
    // calculate column size per row
    const { width } = rowLayout.getBoundingClientRect();
    //console.log("Width = " + width);
    const columnSize = Math.round(width / this.boxWidth) - 1;

    // view has been resized? => update table with new column size
    if (columnSize != this.columnSize) {
      this.columnSize = columnSize;
      this.initTable();
    }
    return this.movieTable;
  }

  initTable() {
    // create table rows based on input list
    // example: [1,2,3,4,5,6] => [ [1,2,3], [4,5,6] ]
    this.movieTable = this.movies
      .filter((_, outerIndex) => outerIndex % this.columnSize == 0) // create outter list of rows
      .map((
        _,
        rowIndex // fill each row from...
      ) =>
        this.movies.slice(
          rowIndex * this.columnSize, // ... row start and
          rowIndex * this.columnSize + this.columnSize // ...row end
        )
      );
  }

  reorderDroppedItem(event: CdkDragDrop<number[]>) {
    // same row/container? => move item in same row
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // different rows? => transfer item from one to another list
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // update items after drop: flatten matrix into list
    // example: [ [1,2,3], [4,5,6] ] => [1,2,3,4,5,6]
    this.movies = this.movieTable.reduce(
      (previous, current) => previous.concat(current),
      []
    );

    // re-initialize table - makes sure each row has same numbers of entries
    // example: [ [1,2], [3,4,5,6] ] => [ [1,2,3], [4,5,6] ]
    this.initTable();
    //console.log(this.movies);
  }

  getMovieIndex(title: string): number{
    return getIndexOfTitle(this.movies, title) + 1;
  }

  testClick(title: string) {
    alert("Hey you clicked " + title);
  }

  ngOnInit(): void {
  }

}
