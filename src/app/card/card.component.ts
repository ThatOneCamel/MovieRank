import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../movie';
import { noPosterImg } from '../mock-movies';
import { MovieListService } from '../movie-list.service';
import { Subscription } from 'rxjs';
import { getIndexByID } from '../rating/movie-manager';
import { Router } from '@angular/router';

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
  listener_A: Subscription;
  listener_B: Subscription;
  static row: number = 1;
  static index: number = 0;
  static MAX_ROW: number;
  static bWon: Boolean = false;
  static bLostOnce: Boolean = false;
  static bLostWorst: Boolean = false;
  static finished: Boolean = false;
  static flag: Boolean = false;
  static flagB: Boolean = false;
  //Selector btn: Selec;

  onClick(): void {
    //A winner has been selected
    //this.movieService.addToLikes(this.title, this.cardID);
    this.movieService.notify(this.cardID, this.movie);

    if(this.cardID == 1){
      this.win_A();
    } else {
      this.win_B();
      this.title = this.movie.title;
    }

    //Calling notify will trigger updateMovie()
    //this.elo = this.movie.elo;
  }

  update_A(): void {
    this.updateCard();

  }

  update_B(): void {
    //If Card_B wins once, it should go to the next row until it can't anymore or loses
      //If it loses afterwards, it will have to battle the indexes on the row it stopped on
        //If it wins every match after, it takes the first spot on that row
        //If it loses it faces the next available index; if no index is available it is placed before the last spot on the row
      //If wins every matchup it will take the #1 spot
    this.movie = this.movieService.getNextTitle();
    this.title = this.movie.title;
    CardComponent.flagB = false;
  }

  isHigher(movie_a: Movie, movie_b: Movie): Boolean {
    let a = getIndexByID(this.movieService.movies, movie_a.id);
    let b = getIndexByID(this.movieService.movies, movie_b.id);
    //A lower index indicates that a movie is higher ranked
    if(a < b){
      return true;
    } else {
      return false;
    }

  }

  win_A(): void {
    //If A wins, instead of going to the next row, check the rest of the indexes on the same row
    //If A wins all, card_B stays in it's spot and the next title is retreived
    //If A wins once, no more rows should be incremented
      //If card_B then wins, it takes the spot of card_A
    //In the event that A is really high on the list and card_B is on a lower row, if A is winning it needs to actually decrement the row
      //until it encounters the same film
    CardComponent.flag = true;
    if(CardComponent.row == CardComponent.MAX_ROW && this.movieService.len % 5 != 0){
     this.incrementIndex();
     this.updateCard();
     if(CardComponent.index >= this.movieService.len % 5){
       CardComponent.row--;
       CardComponent.index = 0;
       this.updateCard();
     }



    } else if(CardComponent.index >= 4 && this.isHigher(this.movie, this.movieService.card_b.movie)){
      CardComponent.index = 0;
      if(CardComponent.row > 1){
        CardComponent.row--;
      }
      this.updateCard();
    } else {
      this.incrementIndex();
      this.updateCard();
    }

    //If A continues to dominate and win everything then encounters the same card
    while(this.movie.id == this.movieService.card_b.movie.id){
      if(this.checkFinished()){
        alert("Finished");
        this.router.navigate(['/results']);
        break;
      } else {
        this.movieService.card_b.update_B();
        this.resetRowAndCol();
        this.updateCard();
      }

    }
  }

  win_B(): void {
    CardComponent.flagB = true;
    //If Card_B has lost once and then wins
    if(CardComponent.flag){
      CardComponent.flag = false;
      this.resetRowAndCol();
      this.swapPos(this.movie, this.movieService.card_a.movie);
      if(this.checkFinished()){
        alert("Finished");
        this.router.navigate(['/results']);
      }  else {
        //If not, just update card_a and card_b as usual
        this.movieService.card_a.updateCard();
        this.update_B();
        
        //Ensuring that card_a and card_b aren't the same
        this.checkSame(this.movie, this.movieService.card_a.movie);
      }

      //If Card_B wins the number one spot
    } else if(CardComponent.row == CardComponent.MAX_ROW && CardComponent.index == 0){
      this.resetRowAndCol();
      this.swapPos(this.movie, this.movieService.card_a.movie);

      //Checking if this was the last movie to be ranked
      if(this.checkFinished()){
        alert("Finished");
        this.router.navigate(['/results']);
      } else {
        //If not, just update card_a and card_b as usual
        this.movieService.card_a.updateCard();
        this.update_B();
        
        //Ensuring that card_a and card_b aren't the same
        this.checkSame(this.movie, this.movieService.card_a.movie);
      }

    } else {
      this.incrementRow();
      this.movieService.card_a.updateCard();
    }

  }

  incrementRow(): void {
    if(CardComponent.row < CardComponent.MAX_ROW){
      CardComponent.row++;
      CardComponent.index = 0;
    } else {
      this.incrementIndex();
    }

  }

  incrementIndex(): void {
    if(CardComponent.row == CardComponent.MAX_ROW && this.movieService.len % 5 != 0){
      if(CardComponent.index < this.movieService.len % 5){
        CardComponent.index++;
      }

    } else if (CardComponent.index < 4){
      CardComponent.index++;
    }

    else if(CardComponent.index >= 4 && this.cardID == 1 && CardComponent.flagB == true){
      //console.log(this.movie.title + " beats " + this.movieService.card_b.title);
      this.swapPosDifRow(this.movieService.card_b.movie, this.movie);
      this.resetRowAndCol();
      this.updateCard();
      this.update_B();
      CardComponent.flag = false;
      CardComponent.flagB = false;
    }
  }

  swapPos(winner: Movie, loser: Movie){
    let win = getIndexByID(this.movieService.movies, winner.id);
    let los = getIndexByID(this.movieService.movies, loser.id);

    this.movieService.arraymove(win, los)
  }

  swapPosDifRow(winner: Movie, loser: Movie){
    let win = getIndexByID(this.movieService.movies, winner.id);
    let los = getIndexByID(this.movieService.movies, loser.id);

    this.movieService.arraymove(win, los + 1)
  }
  updateCard(): void {
    ////console.log("Service ID: " + this.movieService.getGridTitle(CardComponent.row, CardComponent.index).id + "    " + this.movieService.getGridTitle(CardComponent.row, CardComponent.index).title);
    ////console.log("Local ID: " + this.movieService.poppedMovie.id + "   " + this.movieService.poppedMovie.title);
      this.movie = this.movieService.getGridTitle(CardComponent.row, CardComponent.index)
      this.title = this.movie.title;
    

  }

  resetRowAndCol(): void {
    let len = this.movieService.len;
    let unrankedLen = this.movieService.unranked.length;
    //console.log("MAX LEN = " + CardComponent.MAX_ROW);
    //console.log("LEN = " + len)
    //console.log("UNRANKED LEN = " + unrankedLen);

    //Helps solve condition if Card_A is the first on a new row and Card_B is the same movie

      //Takes (total # of movies - num of movies yet to be ranked) / number of columns
    CardComponent.row = Math.ceil( (len - unrankedLen) / 5);
    //CardComponent.row = 1;
    //console.log("ROW and COL RESET");
    //console.log("ROW SET TO " + CardComponent.row);
    //CardComponent.row = 1;
    CardComponent.index = 0;
  }

  checkSame(movie_a: Movie, movie_b: Movie): void {
    if(movie_a.id == movie_b.id){
      this.incrementRow();
      this.movieService.card_a.updateCard();
      //console.log("Found dupe")
    }
  }

  checkFinished(): Boolean {
    if(this.movieService.unranked.length == 0){
      return true;
    } else {
      return false;
    }
  }

  updateMovie(): void {

    /*//The Loser
    if(this.cardID != this.movieService.winner) {

      //If Card_A loses [If Card_B Wins]
      if(this.cardID == 1){

        //If Card_A is the #1 movie and loses
        if(Math.ceil(this.movieService.len / 5) == CardComponent.row && CardComponent.index == 0){
          ////console.log(CardComponent.row)
          //console.log("Loser is replaced with winning movie " + this.movieService.winningMovie.title)
          let los = getIndexByID(this.movieService.movies, this.movie.id);
          let win = getIndexByID(this.movieService.movies, this.movieService.poppedMovie.id);

          this.movieService.arraymove(win, los)
          CardComponent.bWon = true;
          this.resetRowAndCol();

        //Go to next row if not the #1 film
        } else {

          if(CardComponent.row == CardComponent.MAX_ROW){
            if(CardComponent.index < 4){
              CardComponent.index++;
            }

          } else if (!CardComponent.bLostOnce) {
           // //console.log("ROW INCREMENTED")
            //CardComponent.row++;
          }

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
      ////console.log("Returning from update movie [" + this.cardID + "]")

      //If Card_B beat the #1 card or has landed a concrete position
      if(CardComponent.bWon && this.cardID == 2){
        //console.log("BWON " + this.cardID);
        if(this.movieService.unranked.length == 0){
          alert("Finished.")
          CardComponent.finished = true;
        } 
        
        else {
          this.movie = this.movieService.getNextTitle();
          this.title = this.movie.title;
          ////console.log("Updated title = " + this.title);
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
            //console.log("OLD == Card_A");
            this.resetRowAndCol();
            CardComponent.bLostWorst = true;
          }

          //console.log("OLD = " + old.title);
          //console.log("CURRENT_A = " + this.movie.title);
          //console.log("GRID = " + this.movieService.gridTitle.title);
          //console.log("NEW_B = " + this.movieService.getNextTitleNoMod().title);

          if(this.movie.id == this.movieService.getNextTitleNoMod().id && CardComponent.index == 0){
            this.updateCard();
            //console.log("CARD_A == CARD_B");

          }

        }

        //If Card_B wins
      } else if(this.cardID == 2){
        var conditionMet = false;

        //Card_B lost then won
        if(CardComponent.bLostOnce){
          //console.log("IT HAPPENED")
          let win = getIndexByID(this.movieService.movies, this.movieService.poppedMovie.id);
          let los = getIndexByID(this.movieService.movies, this.movieService.gridTitle.id);
          //console.log("Grid = " + this.movieService.gridTitle.title);
          this.movieService.arraymove(win, los);
          CardComponent.bLostOnce = false;
          CardComponent.bLostWorst = false;
          CardComponent.bWon = false;
          conditionMet = true;
          this.resetRowAndCol();
          this.movie = this.movieService.getNextTitle();
          this.title = this.movie.title;
        }

        //Card_B won twice in a row
        if(CardComponent.bWon && CardComponent.row == CardComponent.MAX_ROW){
          this.resetRowAndCol();
          this.movie = this.movieService.getNextTitle();
          this.title = this.movie.title;
          CardComponent.bWon = false;
          conditionMet = true;
        }

        if(!conditionMet){
          CardComponent.bWon = true;
          CardComponent.row++;
        }


      }

    }

    if(this.cardID == 1){
      //console.log("Card_A should update")
      this.updateCard();
    }*/

    /*if(this.cardID == 1 && this.movie == this.movieService.poppedMovie && CardComponent.index == 0){
      CardComponent.row++;
      this.updateCard();
      //console.log("DEBUG AAAAAAAAAAAAAAAA")
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
        //console.log(this.movieService.movies);
        //console.log("BEFORE ^ ^ ^");
        this.movieService.arraymove(this.movieService.unranked.length, this.movieService.len - (5 * CardComponent.row + CardComponent.index) - 1);
        //console.log("AFTER v v v ")
        //console.log(this.movieService.unranked);
        this.movie = this.movieService.getNextTitle();
        this.title = this.movie.title;
        this.resetRowAndCol();
        //console.log("Reached end of col");
        //console.log("Row after " + CardComponent.row);
        return;
      }

      //console.log("GOT CALLED");
      if(CardComponent.row >= this.movieService.len / 5 - 1){
        CardComponent.index++;
      } else {
        CardComponent.row++;
      }
      /*if(CardComponent.index != 0){
        //console.log("WOW")
        this.movie = this.movieService.getNextTitle();
        this.resetRowAndCol();

      } else
      if(this.movieService.finishedRanking == true){
        //this.movie = this.movieService.getNextTitle();
        this.title = this.movie.title;
        this.resetRowAndCol();
        //Need to insert movie where it should go
        //console.log("Ranking = Fin");

      }






    }

    //If 2 loses
    if(this.cardID == 2 && this.cardID != this.movieService.winner){
      //If 2 loses to [row][0]
      /*if (CardComponent.index >= 0 && CardComponent.index < 5){
        CardComponent.index += 1;
        //console.log("MOving along the col");

        //If last element and loses
      }
    }

    //Someone loses

    //Card 1 loses and index < numOfCol
    if(this.cardID == 1 && this.cardID != this.movieService.winner && CardComponent.index < 5){
      //console.log(this.movie.title + " accepts defeat.")
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

    //console.log("ROW = " + CardComponent.row);
    //console.log("INDEX = " + CardComponent.index);
    this.srcStr = "https://ae01.alicdn.com/kf/HTB1F8WgXcnrK1RkHFrdq6xCoFXa8/N-935-Princess-Mononoke-20th-Anniversary-Studio-Ghibli-Hot-Anime1-POSTER-L-W-Canvas-Art-Print.jpg";
    */
  }

  constructor(private router: Router, private movieService: MovieListService) {
    //this.listener = movieService.emitter.subscribe( () => this.updateMovie());
  }

  ngOnInit(): void {
    CardComponent.MAX_ROW = Math.ceil(this.movieService.len / 5);
    if(this.cardID == 2){
      this.movie = this.movieService.getNextTitle();
      this.movieService.card_b = this;
    } else {
      this.movie = this.movieService.getGridTitle(CardComponent.row, CardComponent.index);
      this.movieService.card_a = this;

    }
    this.title = this.movie.title;
    //this.elo = this.movie.elo;
    this.resetRowAndCol();
  }

  ngOnDestroy() {
    //this.listener.unsubscribe();
  }

}
