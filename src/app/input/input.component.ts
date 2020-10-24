import { Movie } from './../movie';
import { Component, OnInit, Input } from '@angular/core';
import { MovieListService } from '../movie-list.service';
import * as MovieManager from '../rating/movie-manager';
import { MOVIES } from '../mock-movies';
import * as retreive from '../rating/getRemoteMovies.js';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() item: string = '';
  list: Movie[] = [];
  counter: number = 0;

  constructor(private movieService: MovieListService, private httpClient: HttpClient) { }

  insert(val: string){
    this.list.push({id: this.counter, title: val});
    this.counter++;
  }

  onEnter(val: string): void {
    //Checking if the string only has whitespace/is empty
    if(val.replace(/\s/g, '').length){
      this.insert(val);
      this.clear();
    }

  }

  async test(){
    let myVar = "https://letterboxd.com/thatmovieguy21/list/tommys-movie-collection/"
    //let options = { params: new HttpParams({fromString: ""})}
    let req = await this.httpClient.post<[]>('https://boxflask-app.herokuapp.com/list', {
      "listurl" : myVar,
    });
    
    req.subscribe(resp => {
      console.log(resp);
      console.log(typeof(resp));
      resp.forEach(name => {
        this.list.push({title: name})
      })
    });
    
    console.log("TEST SUCCESS!");
  }
  onPaste(event: ClipboardEvent): void {
    let pasted = event.clipboardData.getData('text').split(/\r?\n/);
    pasted.forEach(title => { this.insert(title); });
    //This doesn't let the pasted text appear in the input field
    //event.preventDefault();
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    //this.clear();
  }

  parseRemoteList(): void {
    console.log("CALLING PARSE REMOTE");
    let temp = retreive.getList();
    console.log(temp);
  }

  displayList(): string {
    return MovieManager.getMovieTitles(this.list).join(' | ');
  }

  passList(): void {
    console.log("List contained:");
    console.log(this.list);
    this.movieService.setMovies(this.list);
  }

  clear(): void {
    this.item = '';
  }

  clearList(): void {
    this.list = [];
  }

  ngOnInit(): void {
    //this.parseRemoteList();
  }

}
