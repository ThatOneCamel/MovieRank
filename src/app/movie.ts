import { Url } from 'url';

export interface Movie {
    id?: number;
    title: string;
    year?: number;
    release?: Date;
    poster?: Url;
    elo?: number;

}