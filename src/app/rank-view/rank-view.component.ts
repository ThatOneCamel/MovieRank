import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieListService } from '../movie-list.service';

@Component({
  selector: 'app-rank-view',
  templateUrl: './rank-view.component.html',
  styleUrls: ['./rank-view.component.css']
})
export class RankViewComponent implements OnInit {

  constructor(private router: Router, private movieService: MovieListService) {
    if(this.movieService.movies.length == 0){
      //alert('No movies were given, redirecting.');
      router.navigate(['makelist']);
    }
  }

  ngOnInit(): void {
  }

}
