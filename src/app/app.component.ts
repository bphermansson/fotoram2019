// https://sclausen.github.io/ngx-mqtt/

// ng build --prod  --base-href newPicFrame

import { interval, Subscription } from 'rxjs';
import { RestApiService } from "./shared/picturesGet";
import { TimeService } from "./shared/time.service";
import { GcalService} from "./shared/get-gcal-events.service"
import { Component, HostBinding, ɵConsole } from '@angular/core';
import { Observable } from 'rxjs';
import { TempApiService } from './shared/temp-api.service';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { CONFIG } from '../assets/settings';
import { share } from 'rxjs/operators';

var debug = true

@Component({
  selector: 'app-root',
  // Define aanimations for fade in and out. 
  animations: [
    trigger('fade', [
      state('visible', style({
        opacity: 1,
      })),
      state('invisible', style({
        opacity: 0.01,
      })),
      transition('visible => invisible', [
        animate('5s')
      ]),
      transition('invisible => visible', [
        animate('5s')
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
  tempOut: any = [];
  picsubscription: Subscription;
  timesubscription: Subscription;
  eventsubscription: Subscription;
  tempOutsubscription: Subscription;
  c: number=0;
  lblPlayPause = 'Running'
  txtPause = 'Pause'

  picsource = interval(10*1000);  
  currentImage: any;   
  imageDate: any;

  gcalevents: any = []
  countdown=40;
  pictimer = 40 // 40 // How long to show images
  public showInfo:boolean = false;

  isOpen = true;

  item: any;
  summary: any;
  eventdate: any;
  isVisible = true;

  private subscription: Subscription;
  public message: string;

  // Trigger the animation
  toggle() {
    console.log("Toggle!")
    this.isVisible = !this.isVisible;
  }
  
  event: any
  animEnd(event) {
    console.log('Animation Ended');
  }

  constructor(    
    public restApi: RestApiService,
    public TimeApi: TimeService,
    public GcalApi: GcalService,
    private apiService: TempApiService,
    ) {
     }

ngOnInit() {
  // Start with two pictures
  this.loadPictures()
  this.loadPictures()
  this.getTime();
  this.loadgcalEvents()
  this.getOutTemp()

  //this.picsubscription = this.picsource.subscribe(picval => this.loadPictures());

  const eventsource = interval(3600000);     
  this.eventsubscription = eventsource.subscribe(eventval => this.loadgcalEvents());

  const timesource = interval(1000);     
  this.timesubscription = timesource.subscribe(val => this.getTime());
  const temptimersource = interval(60000);     
  this.tempOutsubscription = temptimersource.subscribe(val => this.getOutTemp()); 
}

itemslist = []  // Array
line_marker: any

loadgcalEvents(){
  return this.GcalApi.getGcalEvents().subscribe((data: {}) => {
    this.gcalevents = data;

    //console.log("gcal: " + this.gcalevents[0])
    //console.log("gcal: " + this.gcalevents[0].summary)
    
    for (var x in this.gcalevents) {
      //console.log("gcal: " + this.gcalevents[x].summary)
      var start = new Date (this.gcalevents[x].start) 
      var startYear = start.getFullYear();
      var sstartYear = startYear.toString()
      //var startMonth = start.getMonth() + 1
      var startMonth = fixZeroes(start, "month")
      //var sstartMonth = startMonth.toString()
      var startDay = fixZeroes(start, "day")  // Day with trailing zeroes
      //var startHour = start.getHours()
      var startHour = fixZeroes(start, "hour") 
      //var sstartHour = startHour.toString()
      var startMin = fixZeroes(start, "minute") // Minutes with trailing zeroes
    
      var end = new Date (this.gcalevents[x].end) 
      var endYear = end.getFullYear();
      var sendYear = endYear.toString()
      //var endMonth = end.getMonth() + 1
      var endMonth = fixZeroes(end, "month")

      var sendMonth = endMonth.toString()
      var endDay = fixZeroes(end, "day")  // Day with trailing zeroes
      var endHour = fixZeroes(end, "hour")
      //var sendHour = endHour.toString()
      var endMin = fixZeroes(end, "minute") // Minutes with trailing zeroes
      var sum = this.gcalevents[x].summary

      let eventObj:any = {}       // https://blog.angular-university.io/typescript-2-type-system-how-does-it-really-work-when-are-two-types-compatible-its-actually-quite-different-than-other-type-systems/
      eventObj.summary= sum
      eventObj.start= startYear + startMonth + startDay + " - "  + startHour + ":" + startMin
      eventObj.end = endHour  + ":" + endMin

      this.itemslist.push(eventObj) 
      //console.log("item" + this.itemslist[0].summary)
    }
  })
}

getOutTemp() {
  // Get data from Home Assistant
  // curl -X GET -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxYTI3YTgzN2QwYTU0OTA4OTFlMjExZmY0NTcxNDhmMyIsImlhdCI6MTU3MjE4ODc2NiwiZXhwIjoxODg3NTQ4NzY2fQ.j_YgyPqiQKcnJ0RYrjoYhk-VExslATh5GIo98tg6g50" -H "Content-Type: application/json" http://192.168.1.190:8123/api/states/sensor.emontxv3ehyhtu21d_temperature

  this.apiService.getTempOut().subscribe((data: {})=>{
    var tempData = data;
    this.tempOut = tempData['state']
    console.log("temp:" + this.tempOut);
  });
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
    
    console.log("Load pictures")

    if (this.piclist.length > 1) {
      console.log("Overflow")
      this.piclist.shift()  // Shift out the oldest/first item
    }

    for (var x in this.piclist) {

      console.log("pics:" + x)
    }
    
    //  In config: imageurl: "http://192.168.1.7/newPhotoFrame/",
    this.currentImage = CONFIG.imageurl + this.Pictures.filename
    this.imageDate = this.Pictures.date
    var imageHeight = this.Pictures.height
    var imageWidth = this.Pictures.width
    var imageDate = this.Pictures.imageDate

    if (debug) {
      console.log(this.currentImage)
      console.log(imageHeight + "-" + imageWidth)
      console.log(this.imageDate)
    }
    if (this.imageDate=="") {
      console.log("No date/time!")
      this.showInfo=false;
    }
    else {
      this.showInfo=true;
    }


    //console.log(this.currentImage)
    //console.log(this.imageDate)
    
    // Create list
    this.piclist.push(this.Pictures.filename);

    console.log("Load pic ok")

    // Reset timer
    //this.countdown = this.pictimer;
  })
}
getTime() {
  return this.TimeApi.getTime().subscribe((data: {}) => {
    this.timeNow = data;
    this.countdown--

    if (this.countdown===this.pictimer/8) {
      console.log("Start anim")
      this.toggle()
      console.log(this.isVisible)

    }

    if (this.countdown<0){
      console.log("Reset timer")
      this.countdown=this.pictimer
      this.loadPictures()
      this.toggle()
      console.log(this.isVisible)

    }

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

/*
function day_of_the_month(d)
{ 
  return (d.getDate() < 10 ? '0' : '') + d.getDate();
}
*/
function fixZeroes(cdate, what)
{ 
  switch(what) {
    case "day":
      return (cdate.getDate() < 10 ? '0' : '') + cdate.getDate();
      break
    case "minute":
        return (cdate.getMinutes() < 10 ? '0' : '') + cdate.getMinutes();
      break
    case "hour":
        return (cdate.getHours() < 10 ? '0' : '') + cdate.getHours();
      break
      case "month":
          var cmdate = cdate.getMonth() +1  // Months start at zero, add '1' to correct
          console.log(cmdate)
          return (cmdate < 10 ? '0' : '') + cmdate
        break
        
  }
}
