import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { noPosterImg } from '../mock-movies';
import { Movie } from '../movie';
import { MovieListService } from '../movie-list.service';
import { getIndexOfTitle } from '../rating/movie-manager';

@Component({
  selector: 'app-arrange',
  templateUrl: './arrange.component.html',
  styleUrls: ['./arrange.component.css']
})
export class ArrangeComponent implements OnInit {

  placeholderImg = noPosterImg;
  movies: Movie[] = [];

  constructor(private router: Router, private movieService: MovieListService) {
    this.movies = this.movieService.getMovies();
    if (this.movies.length == 0){
      router.navigate(['/makelist']);
    }
  }
  
  movieTable: Array<Movie[]>;

  // fix column width as defined in CSS (150px + 5px margin)
  boxWidth = 150;
  // calculated based on dynamic row width
  columnSize: number;

  getItemsTable(rowLayout: Element): Movie[][] {
    // calculate column size per row
    const { width } = rowLayout.getBoundingClientRect();
    console.log("Width = " + width);
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
