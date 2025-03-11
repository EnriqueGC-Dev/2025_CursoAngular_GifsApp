import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap, } from 'rxjs';


const loadFromLocalStorage = () => {
    const gifsFromLocalStorage = localStorage.getItem('gifs') ?? '{}'
    const gifs = JSON.parse(gifsFromLocalStorage)

    return gifs
}

@Injectable({providedIn: 'root'})
export class GifService {
    
    private http = inject(HttpClient)

    trendingGifs = signal<Gif[]>([])
    trendingGifsIsLoading = signal(true)

    searchHistory = signal< Record<string, Gif[]> > (loadFromLocalStorage())
    searchHistoryKeys = computed(() => Object.keys(this.searchHistory()) )

    constructor() {
        this.loadTrendingGifs()
    }

    saveGifsToLocalStorage = effect(() => {
        const historyString = JSON.stringify(this.searchHistory())
        localStorage.setItem('Gifs', historyString)
    })

    loadTrendingGifs() {
        this.http.get<GiphyResponse>(`${environment.giphyURL}/gifs/trending`, {
            params: {
                api_key: environment.giphyApiKey,
                limit: 20
            }
        }).subscribe( (resp) => {
            const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data)
            this.trendingGifs.set(gifs)
            this.trendingGifsIsLoading.set(false)
        } )
    }

    SearchGifs(query:string) {
        return this.http.get<GiphyResponse>(`${environment.giphyURL}/gifs/search`, {
            params: {
                q: query,
                api_key: environment.giphyApiKey,
                limit: 20
            }
        }).pipe(
            map(({data}) => data),
            map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

            //TODO: Historial
            tap(items => {
                this.searchHistory.update(history => ({
                    ...history, [query.toLowerCase()] : items
                }))
            })
        )
    }

    getHistoryGifs (query:string):Gif[] {
        return this.searchHistory()[query] ?? []
    }

}