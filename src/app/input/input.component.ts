import { Movie } from './../movie';
import { Component, OnInit, Input } from '@angular/core';
import { MovieListService } from '../movie-list.service';
import * as MovieManager from '../rating/movie-manager';
import { MOVIES, MOVIES2 } from '../mock-movies';
import * as retreive from '../rating/getRemoteMovies.js';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() item: string = '';
  apiURL: string = 'https://boxdscrape-production.up.railway.app/'
  list: Movie[] = [];
  counter: number = 0;
  @Input() showBar = false;

  constructor(private movieService: MovieListService, private httpClient: HttpClient) { }

  insert(val: string){
    this.list.push({id: this.counter, title: val});
    this.counter++;
    this.showBar = false;

  }

  shuffle(){
    this.list = this.list.map((a) => ({sort: Math.random(), value: a}))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)
  }

  onEnter(val: string): void {
    //Checking if the string only has whitespace/is empty
    if(val.replace(/\s/g, '').length){
      this.insert(val);
      this.clear();
    }

  }

  async getRemoteList(url: string){
    this.showBar = true;
    url.replace(/\/$/, "");
    //console.log("Retreiving list from " + url);

    //let myVar = "https://letterboxd.com/thatmovieguy21/list/tommys-movie-collection/"
    //let options = { params: new HttpParams({fromString: ""})}
    let req = await this.httpClient.post<[]>(this.apiURL, {
      "listurl" : url,
    });

    req.subscribe(resp => {
      //console.log(resp);
      //console.log(typeof(resp));
      resp.forEach(name => {
        this.insert(name);
      })
    });
    //console.log("TEST SUCCESS!");
  }
  
  onPaste(event: ClipboardEvent): void {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    var clipboardText = event.clipboardData.getData('text');

    //console.log(urlRegex.test(clipboardText));
    //console.log("ONPASTE CALLED")

    if(urlRegex.test(event.clipboardData.getData('text')) && (clipboardText.includes('letterboxd') || clipboardText.includes('boxd.it')) ){
      //console.log("Link detected.")
      //alert("Stay patient, your list is being created.")
      this.getRemoteList(clipboardText);

    } else {
      let pasted = clipboardText.split(/\r?\n/);
      pasted.forEach(title => { this.insert(title); });

    }

    //This doesn't let the pasted text appear in the input field
    //event.preventDefault();
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);

    //this.clear();
  }

  parseRemoteList(): void {
    //console.log("CALLING PARSE REMOTE");
    let temp = retreive.getList();
    //console.log(temp);
  }

  displayList(): string {
    return MovieManager.getMovieTitles(this.list).join(' | ');
  }

  passList(): void {
    //console.log("List contained:");
    //console.log(this.list);
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

  sampleList(): void {
    this.movieService.setMovies(MOVIES2);
  }

}
