import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../photo/Photo';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PhotoService } from '../photo/photo.service';

@Component({
  selector: 'st-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css']
})

export class PhotoListComponent implements OnInit, OnDestroy {

  photos : Photo[] = [];
  filter : string = '';
  debounce: Subject<any> = new Subject<any>();
  hasMore: boolean = true;
  currentPage: number = 1;
  userName: string = '';
 
  constructor(
    private activatedRoute : ActivatedRoute,
    private photoService : PhotoService
    ){}
  
  onKeyUp(target : any) {
    if(target instanceof EventTarget) {
      var elemento = target as HTMLInputElement;
      this.filter = elemento.value;
    }
  }
  
  ngOnInit(): void {

    this.userName = this.activatedRoute.snapshot.params['userName'];
    this.photos = this.activatedRoute.snapshot.data['photos'];
    this.debounce.pipe(debounceTime(300))
    .subscribe(filter => this.filter  = filter);
  }  
  
  ngOnDestroy(): void {
    this.debounce.unsubscribe();
  }

  load(){
    this.photoService
    .listFromUserPaginated(this.userName, ++this.currentPage)
    .subscribe(photos => {
      this.photos = this.photos.concat(photos);
    
    if(!photos.length) this.hasMore = false;

    });
  }
  
}
