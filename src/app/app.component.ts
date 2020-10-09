// https://sclausen.github.io/ngx-mqtt/

// ng build --prod  --base-href newPicFrame

import { interval, Subscription } from 'rxjs';
import { PictureApiService } from "./shared/picturesGet";
import { TimeService } from "./shared/time.service";
import { GcalService} from "./shared/get-gcal-events.service"
import { OneItem } from '../models/gcalItems.model';
import { Component, HostBinding, ɵConsole } from '@angular/core';
//import {HttpClient} from "@angular/common/http";
import * as _ from 'lodash';
import { HaData } from './hadata.service';
//import { TempService } from './temp.service';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { CONFIG } from '../assets/settings';
//import { notEqual } from 'assert';
import { isNullOrUndefined } from 'util';
//import { connect } from 'http2';
import { _getOptionScrollPosition } from '@angular/material/core';

var debug = true

@Component({
  selector: 'app-root',
  // Define animations for fade in and out. 
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
  temp = "0"
  lawnmowerstate
  Pictures: any = [];
  timeNow: any = [];
  piclist: any = [];
  picsubscription: Subscription;
  timesubscription: Subscription;
  hasubscription: Subscription;
  eventsubscription: Subscription;
  c: number=0;
  lblPlayPause = 'Running'
  txtPause = 'Pause'
  picsource = interval(10*1000);  
  currentImage: any;   
  imageDate: any;
  countdown=40;
  pictimer = 40 // 40 // How long to show images
  public showInfo:boolean = false;
  isOpen = true;
  
  isVisible = true;
  lmStatus: string
  loading: boolean = false;
  errorMessage;

  public oneItem: OneItem;  
  empList: Array<OneItem> = [];

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
    public PictureApi: PictureApiService,
    public TimeApi: TimeService,
    private gcalService: GcalService,
    //private http:HttpClient,
    private haData:  HaData
    ) 
    {
      this.oneItem = new OneItem();
    }



ngOnInit() {
  // Start with two pictures
  this.loadPictures()
  this.loadPictures()
  this.getTime();
  this.loadgcalEvents()
  this.getHaData()

  const eventsource = interval(3600000);     
  this.eventsubscription = eventsource.subscribe(eventval => this.loadgcalEvents());
  const timesource = interval(1000);     
  this.timesubscription = timesource.subscribe(val => this.getTime());
  const hasource = interval(10000);     
  this.hasubscription = hasource.subscribe(val => this.getHaData());
}

line_marker: any

getHaData(): void {
  console.log("Get HaData")
  this.temp = this.haData.state
  this.lawnmowerstate = this.haData.lawnmowerstate
  class HadataClass {
    id: string;
    name: string;
    last_changed: string
  }
  var haData: HadataClass[] = [];
  haData = this.haData.getHadata();
  /*
  console.log("Fetched hadata: " + haData)

  haData.forEach(element => {
    console.log("ElementInComponent:" + element)            
  });
  */
}

loadgcalEvents(){
  this.loading = true;
  console.log("Get Gcal data");

    this.errorMessage = "";
    this.gcalService.getcalEvents()
      .subscribe(
        (response) => {                           //next() callback
          // Here we handle the response from the Google Calender events server. 
          console.log('response received:' + response.length)
          var c=0
          
          var cts = CONFIG.calsToShow;
          response.forEach(element => {
            //console.log("Item " + c + element["Summary"]) // Here we have all elements
            c++
            var currentCreator = element["Creatoremail"];
            if (cts.indexOf(currentCreator) == 0) {
              let curItem = new OneItem;
              curItem.Summary = element["Summary"]
              curItem.Starttime = element["Starttime"]
              curItem.Endtime = element["Endtime"]
              curItem.Creator = element["Creator"]
              curItem.Creatoremail = element["Creatoremail"]
              curItem.OrganizerDisplayName = element["OrganizerDisplayName"]

              //"Creator":null,"Creatoremail":"hermansson.patrik@gmail.com","OrganizerId":null,"OrganizerDisplayName":null
              /*
              All items don't have the same info. Try to collect all relevant events. 
              */
              curItem.DisplayName = curItem.Creator;
              if (isNullOrUndefined(curItem.DisplayName)) {
                curItem.DisplayName = curItem.OrganizerDisplayName;
              }
              if (isNullOrUndefined(curItem.DisplayName)) {
                curItem.DisplayName = curItem.Creatoremail;
              }
              this.empList.push(curItem)
            }

          }); 
          /*
          this.empList.forEach(element => {
            console.log(element.Summary + "-" + element.Creator)
            console.log(element.OrganizerDisplayName)
          });
          */
        },
        (error) => {                              //error() callback
          console.error('Request failed with error')
          this.errorMessage = error;
          this.loading = false;
        },
        () => {                                   //complete() callback
          console.error('Request completed')      //This is actually not needed 
          this.loading = false; 
        })
}

loadPictures() {
  return this.PictureApi.getPictures().subscribe((data: {}) => {
    this.Pictures = data;
    /*
    Store old picture path and new picture path to make it possible to rewind to previous image

    */
    //console.log(this.c);
    //console.log(this.Pictures);
    console.log(this.Pictures.filename)
    
    console.log("Load pictures")

    if (this.piclist.length > 1) {
      console.log("Overflow")
      this.piclist.shift()  // Shift out the oldest/first item
      console.log("No of pics: " + this.piclist.length)

    }

    for (var x in this.piclist) {

      console.log("pics:" + x)
    }
    
    //  In config: imageurl: "http://192.168.1.7/newPhotoFrame/",
    this.currentImage = CONFIG.baseurl + "bilderFotoram/" + this.Pictures.filename
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
