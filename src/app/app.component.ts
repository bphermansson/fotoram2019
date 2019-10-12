
import { interval, Subscription } from 'rxjs';
import { RestApiService } from "./shared/picturesGet";
import { TimeService } from "./shared/time.service";
import { GcalService} from "./shared/get-gcal-events.service"
import { Component, HostBinding } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { CONFIG } from '../assets/settings';

@Component({
  selector: 'app-root',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'blue'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.5,
        backgroundColor: 'green'
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],


})
export class AppComponent {
  title = 'angular-httpclient-app';
  Pictures: any = [];
  timeNow: any = [];
  piclist: any = [];
  picsubscription: Subscription;
  timesubscription: Subscription;
  eventsubscription: Subscription;
  c: number=0;
  lblPlayPause = 'Running'
  txtPause = 'Pause'

  picsource = interval(40*1000);  
  currentImage: any;   
  imageDate: any;

  gcalevents: any = []
  countdown=40;

  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  constructor(    
    public restApi: RestApiService,
    public TimeApi: TimeService,
    public GcalApi: GcalService,
    ) { }

ngOnInit() {
  // Start with two pictures
  this.loadPictures()
  this.loadPictures()
  this.getTime();
  this.loadgcalEvents()

  this.picsubscription = this.picsource.subscribe(picval => this.loadPictures());

  const eventsource = interval(10000);     
  this.eventsubscription = eventsource.subscribe(eventval => this.loadgcalEvents());

  const timesource = interval(1000);     
  this.timesubscription = timesource.subscribe(val => this.getTime()); 
}

item: any;
summary: any;

//olddata: {};

loadgcalEvents(){
  return this.GcalApi.getGcalEvents().subscribe((data: {}) => {
    this.gcalevents = data;
    //console.log("gcal: " + this.gcalevents)
    this.summary = this.gcalevents.Events[1][1];

    console.log("gcal: " + this.summary)
  })
}

loadPictures() {
  return this.restApi.getPictures().subscribe((data: {}) => {
    this.Pictures = data;

    /*
    Store old picture path and new picture path to make it possible to rewind to previous image

    */
    //console.log(this.c);
    //console.log(this.Pictures);
    //console.log(this.Pictures.filename)
    
    console.log(this.piclist.length)

    if (this.piclist.length > 4) {
      console.log("Overflow")
      this.piclist.shift()  // Shift out the oldest/first item
    }

    
    this.currentImage = CONFIG.imageurl + this.Pictures.filename
    this.imageDate = this.Pictures.date

    console.log(this.currentImage)
    console.log(this.imageDate)
    
    // Create list
    this.piclist.push(this.Pictures.filename);

    // Reset timer
    this.countdown = 40;
  })
}
getTime() {
  return this.TimeApi.getTime().subscribe((data: {}) => {
    this.timeNow = data;
    this.toggle()    
    this.countdown--
    //console.log(this.countdown)

    //console.log("Time: " + this.timeNow);
  })
}

pauseShift(){
  console.log("Pause")

  console.log(this.picsubscription.closed)

  if (!this.picsubscription.closed) {
    // Timer is running, stop it
    this.picsubscription.unsubscribe()
    this.lblPlayPause = "Stopped"
    this.txtPause = 'Play'
    console.log(this.picsubscription.closed)
  }
  else {
    // Timer is stopped, start it
    this.picsubscription = this.picsource.subscribe(picval => this.loadPictures());
    console.log(this.picsubscription.closed)
    this.lblPlayPause = "Running"
    this.txtPause = 'Pause'
  }
}

}
