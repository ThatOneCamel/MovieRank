import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  listener: Subscription;
  //Selector btn: Selec;

  onClick(): void {
    console.log("Hey you clicked card #" + this.cardID)
    this.movieService.addChosenMovie(this.title, this.cardID);
    //this.movieService.notify(this.cardID);
    console.log(this.movieService.halfA)
    console.log(this.movieService.halfB)
    
    if(this.movieService.halfA.length == 0){
      alert("No more movies to sift through");
      console.log("You seem to really like:");
      console.log(this.movieService.likes);
    }

  }

  getMovie(): void {
    this.title = this.movieService.getRandTitle(this.cardID);
  }

  updateMovie(): void {
    console.log("CARD ID WAS " + this.cardID)
    this.title = this.movieService.getNextTitle(this.title, this.cardID);
    this.srcStr = "https://ae01.alicdn.com/kf/HTB1F8WgXcnrK1RkHFrdq6xCoFXa8/N-935-Princess-Mononoke-20th-Anniversary-Studio-Ghibli-Hot-Anime1-POSTER-L-W-Canvas-Art-Print.jpg";
  }

  constructor(private movieService: MovieListService) {
    this.listener = movieService.emitter.subscribe( () => this.updateMovie());

  }

  ngOnInit(): void {
    this.getMovie();
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

}
