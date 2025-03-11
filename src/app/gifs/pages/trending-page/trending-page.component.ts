import { GifService } from './../../services/gifs.service';
import { Component, inject } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list/gif-list.component";

@Component({
  selector: 'app-trending-page',
  imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent { 

  GifService = inject( GifService )

}
