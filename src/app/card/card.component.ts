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
    this.movieService.notify();
  }

  getMovie(): void {
    this.title = this.movieService.getRand();
  }

  updateMovie(): void {
    this.title = this.movieService.popTitle(this.title);
    this.srcStr = "https://ae01.alicdn.com/kf/HTB1F8WgXcnrK1RkHFrdq6xCoFXa8/N-935-Princess-Mononoke-20th-Anniversary-Studio-Ghibli-Hot-Anime1-POSTER-L-W-Canvas-Art-Print.jpg";
  }

  constructor(private movieService: MovieListService) {
    this.getMovie();
    this.listener = movieService.emitter.subscribe( () => this.updateMovie());

  }

  ngOnInit(): void {
    this.getMovie();
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

}
