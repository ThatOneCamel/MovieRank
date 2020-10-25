import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../movie';
import { noPosterImg } from '../mock-movies';
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
  placeholderImg = noPosterImg;
  movie: Movie;
  elo: number;
  listener: Subscription;
  static row: number = 1;
  static index: number = 0;
  //Selector btn: Selec;

  onClick(): void {
    //A winner has been selected
    this.movieService.addToLikes(this.title, this.cardID);
    this.movieService.notify(this.cardID, this.movie);
    //this.elo = this.movie.elo;
  }

  resetRowAndCol(): void {
    console.log("ROW and COL RESET");
    CardComponent.row = 1;
    CardComponent.index = 0;
  }

  updateMovie(): void {
    //Makes call for elo adjustment, only the loser's title should change
    //Excluding special cases
    //Card 2 is the popped element
    //If card 2 wins
    if(this.cardID == 2 && this.cardID == this.movieService.winner){
      //Row is technically going up

      if(CardComponent.index >= 4){
        this.movie = this.movieService.getNextTitle();
        this.resetRowAndCol();
        console.log("Reached end of col");
        console.log("Row after " + CardComponent.row);
        return;
      }

      console.log("GOT CALLED");
      if(CardComponent.row >= this.movieService.len / 5 - 1){
        CardComponent.index++;
      } else {
        CardComponent.row++;
      }
      /*if(CardComponent.index != 0){
        console.log("WOW")
        this.movie = this.movieService.getNextTitle();
        this.resetRowAndCol();

      } else */
      if(this.movieService.finishedRanking == true){
        this.movie = this.movieService.getNextTitle();
        this.resetRowAndCol();
        //Need to insert movie where it should go
        console.log("Ranking = Fin");

      }






    }

    //If 2 loses
    if(this.cardID == 2 && this.cardID != this.movieService.winner){
      //If 2 loses to [row][0]
      /*if (CardComponent.index >= 0 && CardComponent.index < 5){
        CardComponent.index += 1;
        console.log("MOving along the col");

        //If last element and loses
      }*/
    }

    //Someone loses

    //Card 1 loses and index < numOfCol
    if(this.cardID == 1 && this.cardID != this.movieService.winner && CardComponent.index < 5){
      console.log(this.movie.title + " accepts defeat.")
      this.movieService.acceptDefeat(this.cardID, this.movie);
      this.movie = this.movieService.getGridTitle(CardComponent.row, CardComponent.index);
      //CardComponent.row += 1;
      //CardComponent.index ++;
      this.title = this.movie.title;
      //this.elo = this.movie.elo;

    } else if (this.cardID == 1 && CardComponent.index >= 4){
      this.resetRowAndCol();
    } else if (this.cardID == 1 && this.cardID == this.movieService.winner){
      this.movie = this.movieService.getGridTitle(CardComponent.row, CardComponent.index);
      CardComponent.index++;

    }

    console.log("ROW = " + CardComponent.row);
    console.log("INDEX = " + CardComponent.index);
    this.srcStr = "https://ae01.alicdn.com/kf/HTB1F8WgXcnrK1RkHFrdq6xCoFXa8/N-935-Princess-Mononoke-20th-Anniversary-Studio-Ghibli-Hot-Anime1-POSTER-L-W-Canvas-Art-Print.jpg";
  }

  constructor(private movieService: MovieListService) {
    this.listener = movieService.emitter.subscribe( () => this.updateMovie());


  }

  ngOnInit(): void {
    this.movie = this.movieService.getGridTitle(CardComponent.row, CardComponent.index);
    if(this.cardID == 2){
      this.movie = this.movieService.getNextTitle();
    }
    this.title = this.movie.title;
    this.elo = this.movie.elo;
    this.resetRowAndCol();
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

}
