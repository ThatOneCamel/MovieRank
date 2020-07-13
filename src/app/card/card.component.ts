import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../movie';
import { MovieListService } from '../movie-list.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() title: string;
  @Input() srcStr: string;
  @Input() cardID: number;
  movie: Movie;
  elo: number;
  listener: Subscription;
  //Selector btn: Selec;

  onClick(): void {
    //A winner has been selected
    this.movieService.addToLikes(this.title, this.cardID);
    this.movieService.notify(this.cardID, this.movie);
    this.elo = this.movie.elo;
  }

  updateMovie(): void {
    //Makes call for elo adjustment, only the loser's title should change
    //Excluding special cases
    if(this.cardID != this.movieService.winner){
      console.log(this.movie.title + " accepts defeat.")
      this.movieService.acceptDefeat(this.cardID, this.movie);
      this.movie = this.movieService.getNextTitle(this.movie, this.cardID);
      this.title = this.movie.title;
      this.elo = this.movie.elo;
    }

    this.srcStr = "https://ae01.alicdn.com/kf/HTB1F8WgXcnrK1RkHFrdq6xCoFXa8/N-935-Princess-Mononoke-20th-Anniversary-Studio-Ghibli-Hot-Anime1-POSTER-L-W-Canvas-Art-Print.jpg";
  }

  constructor(private movieService: MovieListService) {
    this.listener = movieService.emitter.subscribe( () => this.updateMovie());


  }

  ngOnInit(): void {
    this.movie = this.movieService.getRandMovie();
    this.title = this.movie.title;
    this.elo = this.movie.elo;  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

}
