import { GifService } from 'src/app/gifs/services/gifs.service';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifListComponent } from "../../components/gif-list/gif-list/gif-list.component";

@Component({
  selector: 'app-gif-history',
  imports: [GifListComponent],
  templateUrl: './gif-history.component.html',
})
export default class GifHistoryComponent { 

  gifService = inject(GifService)

  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(params => params['query'])
    )
  )

  gifsByKey = computed(() => 
    this.gifService.getHistoryGifs (this.query())
  )

}
