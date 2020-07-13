import { Movie } from '../movie';
import * as Elo from './elo';

export function getMovieTitles(movies: Movie[]): string[] {
    return movies.map(m => { return m.title; });
}

export function getIndexOfTitle(movies: Movie[], title: string): number {
    return movies.map(m => { return m.title; }).indexOf(title);
}

export function getRandomTitle(movies: Movie[]): string {
    return movies[Math.floor(Math.random() * movies.length)].title;
}

export function getRandomMovie(movies: Movie[]): Movie {
    return movies[Math.floor(Math.random() * movies.length)];
}

export function getMovieIdAsString(movies: Movie[]): string {
    return JSON.stringify(
        movies.map(m => ({title: m.title, id: m.id}))
    );
}

export function splitMovieArr(movies: Movie[]): Movie[] {
    var len = Math.ceil(movies.length / 2);
    var randomArr: Movie[] = [];
    while(randomArr.length < len){
        let rand = Math.floor(Math.random() * movies.length);
        randomArr.push(movies.splice(rand, 1)[0])
    }

    return randomArr;
}

export function adjustElo(winner: Movie, loser: Movie): void{
    winner.elo = Elo.getNewRating(winner.elo, loser.elo, 1);
    console.log("Winner should have " + winner.elo) 
    loser.elo = Elo.getNewRating(loser.elo, winner.elo, 0);
    console.log("Loser should have " + loser.elo) 

}

export function initElo(movies: Movie[]){
    movies.forEach(movie => {
        movie.elo = 500;
    })
}