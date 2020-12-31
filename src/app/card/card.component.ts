import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../movie';
import { noPosterImg } from '../mock-movies';
import { MovieListService } from '../movie-list.service';
import { Subscription } from 'rxjs';
import { getIndexByID } from '../rating/movie-manager';

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
  static bWon: Boolean = false;
  static bLostOnce: Boolean = false;
  static bLostWorst: Boolean = false;
  static finished: Boolean = false;
  //Selector btn: Selec;

  onClick(): void {
    //A winner has been selected
    //this.movieService.addToLikes(this.title, this.cardID);
    this.movieService.notify(this.cardID, this.movie);

    //Calling notify will trigger updateMovie()
    //this.elo = this.movie.elo;
  }

  updateCard(): void {
    //console.log("Service ID: " + this.movieService.getGridTitle(CardComponent.row, CardComponent.index).id + "    " + this.movieService.getGridTitle(CardComponent.row, CardComponent.index).title);
    //console.log("Local ID: " + this.movieService.poppedMovie.id + "   " + this.movieService.poppedMovie.title);
    if(this.movieService.getGridTitle(CardComponent.row, CardComponent.index).id == this.movieService.poppedMovie.id){
      console.log("NOPE");
      return;
    } else {
      this.movie = this.movieService.getGridTitle(CardComponent.row, CardComponent.index)
      this.title = this.movie.title;
    }

  }

  updateLoser(loserID: number): void {
    if(loserID == 1){
      console.log("Hi")
      this.movie = this.movieService.getGridTitle(CardComponent.row, CardComponent.index);
    }
  }

  resetRowAndCol(): void {
    let MAX = Math.ceil(this.movieService.len / 5);
    let len = this.movieService.len;
    let unrankedLen = this.movieService.unranked.length;
    console.log("MAX LEN = " + MAX);
    console.log("LEN = " + len)
    console.log("UNRANKED LEN = " + unrankedLen);

    //Helps solve condition if Card_A is the first on a new row and Card_B is the same movie
    if(len - (len % unrankedLen) <= 6){
      CardComponent.row = MAX;
    } else {
      //Takes (total # of movies - num of movies yet to be ranked) / number of columns
      CardComponent.row = Math.ceil( (len - unrankedLen) / 5);
    }
    //CardComponent.row = 1;
    console.log("ROW and COL RESET");
    console.log("ROW SET TO " + CardComponent.row);
    //CardComponent.row = 1;
    CardComponent.index = 0;
  }

  bLostOnce(): void {

  }

  bLostTwice(): void {

  }

  bWins(): void {

  }

  updateMovie(): void {
    //Modifying the loser
    if(this.cardID != this.movieService.winner) {
      console.log("I lost [" + this.cardID + "]")

      //If Card_A loses
      if(this.cardID == 1){

        //If Card_A is the #1 movie and loses
        if(this.movieService.len / 5 == CardComponent.row && CardComponent.index == 0){
          console.log(CardComponent.row)
          console.log("Loser is replaced with winning movie " + this.movieService.winningMovie.title)
          this.movieService.arraymove(9, this.movieService.len - (CardComponent.row * 5))
          CardComponent.bWon = true;
          this.resetRowAndCol();

        //Go to next row if not the #1 film
        } else {
          CardComponent.row++;
        }

        //Updates Card_A
        if(!CardComponent.finished){
          this.updateCard();
        }

      } else if(this.cardID == 2 && CardComponent.bLostWorst){
        if(this.movieService.getNextTitleNoMod())
        this.movie = this.movieService.getNextTitle();
        this.title = this.movie.title;
        CardComponent.bLostWorst = false;
  
      }
// -------------------------------------------------------------------

    //Modifying the winner
    } else if(this.cardID == this.movieService.winner){
      console.log("Returning from update movie [" + this.cardID + "]")

      //If Card_B beat the #1 card or has landed a concrete position
      if(CardComponent.bWon && this.cardID == 2){
        console.log("BWON " + this.cardID);
        if(this.movieService.unranked.length == 0){
          alert("Finished.")
          CardComponent.finished = true;
        } 
        
        else {
          this.movie = this.movieService.getNextTitle();
          this.title = this.movie.title;
          //console.log("Updated title = " + this.title);
          //this.resetRowAndCol();
          CardComponent.bWon = false;
        }
      //If Card_A is the winner
      } else if (this.cardID == 1){

        CardComponent.bLostOnce = true;
        if(CardComponent.index < 4){
          CardComponent.index++;

          let old = this.movie;
          this.updateCard();

          if(old.id == this.movie.id){
            console.log("SAME");
            this.resetRowAndCol();
            CardComponent.bLostWorst = true;
          }

          console.log("OLD = " + old.title);
          console.log("CURRENT_A = " + this.movie.title);
          console.log("NEW_B = " + this.movieService.getNextTitleNoMod().title);

          if(this.movie.id == this.movieService.getNextTitleNoMod().id && CardComponent.index == 0){
            this.updateCard();
            console.log("CARD_A == CARD_B");

          }

        } else if (getIndexByID(this.movieService.movies, this.movieService.poppedMovie.id) % 5 == 0){

          let MAX = Math.ceil(this.movieService.len / 5);
          let pos = getIndexByID(this.movieService.movies, this.movie.id);
          this.resetRowAndCol();
          let old = this.movie;
          this.updateCard();
          CardComponent.bLostWorst = true;
        } else if (getIndexByID(this.movieService.movies, this.movie.id) % 5 == 0){
          console.log("...............")
        }

      }

    }

    /*if(this.cardID == 1 && this.movie == this.movieService.poppedMovie && CardComponent.index == 0){
      CardComponent.row++;
      this.updateCard();
      console.log("DEBUG AAAAAAAAAAAAAAAA")
      //Need to make sure not to go over the maxnum of rows
    }*/





    /*
    //Makes call for elo adjustment, only the loser's title should change
    //Excluding special cases
    //Card 2 is the popped element
    //If card 2 wins
    if(this.cardID == 2 && this.cardID == this.movieService.winner){
      //Row is technically going up

      if(CardComponent.index >= 4){
        console.log(this.movieService.movies);
        console.log("BEFORE ^ ^ ^");
        this.movieService.arraymove(this.movieService.unranked.length, this.movieService.len - (5 * CardComponent.row + CardComponent.index) - 1);
        console.log("AFTER v v v ")
        console.log(this.movieService.unranked);
        this.movie = this.movieService.getNextTitle();
        this.title = this.movie.title;
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

      } else
      if(this.movieService.finishedRanking == true){
        //this.movie = this.movieService.getNextTitle();
        this.title = this.movie.title;
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
      }
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
      this.title = this.movie.title;
      CardComponent.index++;

    }

    console.log("ROW = " + CardComponent.row);
    console.log("INDEX = " + CardComponent.index);
    this.srcStr = "https://ae01.alicdn.com/kf/HTB1F8WgXcnrK1RkHFrdq6xCoFXa8/N-935-Princess-Mononoke-20th-Anniversary-Studio-Ghibli-Hot-Anime1-POSTER-L-W-Canvas-Art-Print.jpg";
    */
  }

  constructor(private movieService: MovieListService) {
    this.listener = movieService.emitter.subscribe( () => this.updateMovie());

  }

  ngOnInit(): void {
    if(this.cardID == 2){
      this.movie = this.movieService.getNextTitle();
    } else {
      this.movie = this.movieService.getGridTitle(CardComponent.row, CardComponent.index);
    }
    this.title = this.movie.title;
    //this.elo = this.movie.elo;
    this.resetRowAndCol();
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

}
