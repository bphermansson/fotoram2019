// https://sclausen.github.io/ngx-mqtt/

// ng build --prod  --base-href newPicFrame

import { interval, Subscription } from 'rxjs';
import { PictureApiService } from "./shared/picturesGet";
import { TimeService } from "./shared/time.service";
import { GcalService} from "./shared/get-gcal-events.service"
//import { calendarItem } from '../models/googleCalendar.model';
import { OneItem } from '../models/gcalItems.model';
import { Component, HostBinding, ɵConsole } from '@angular/core';
//import { Observable } from 'rxjs';
import { TempApiService } from './shared/temp-api.service';
import { HADataService } from "./shared/hadata.service";
import {HttpClient} from "@angular/common/http";
import * as _ from 'lodash';
//import { map } from 'rxjs/operators';

// Home Assistant web api
import {
  getAuth,
  getUser,
  callService,
  createConnection,
  subscribeEntities,
  ERR_HASS_HOST_REQUIRED
} from '../../dist/index.js';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { CONFIG } from '../assets/settings';
import { notEqual } from 'assert';
import { isNullOrUndefined } from 'util';
//import { settings } from 'cluster';
//import { share } from 'rxjs/operators';

var debug = true

/*
interface Course {
  startDate: String;
  summary: String;
  starttime: String;
  endtime: String;
  creator: String;
}
*/
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
  hasubscription: Subscription;
  c: number=0;
  lblPlayPause = 'Running'
  txtPause = 'Pause'
  haData: any = [];
  picsource = interval(10*1000);  
  currentImage: any;   
  imageDate: any;
  countdown=40;
  pictimer = 40 // 40 // How long to show images
  public showInfo:boolean = false;
  isOpen = true;
  
  isVisible = true;
  temp: any;
  lmStatus: string
  loading: boolean = false;
  errorMessage;

  /*
  gcalevents: calendarItem[]
  item: any;
  summary: any;
  eventdate: any;
  */

  //private subscription: Subscription;
  //public message: string;
  public oneItem: OneItem;
  //public events: any[];
  
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
    private apiService: TempApiService,
    public haApi: HADataService,
    private http:HttpClient
    ) {
      this.oneItem = new OneItem();
     }

ngOnInit() {
  // Start with two pictures
  this.loadPictures()
  this.loadPictures()
  this.getTime();
  this.loadgcalEvents()
  //this.getOutTemp()
  this.getHaData()

  //this.picsubscription = this.picsource.subscribe(picval => this.loadPictures());

  const eventsource = interval(3600000);     
  this.eventsubscription = eventsource.subscribe(eventval => this.loadgcalEvents());
  const timesource = interval(1000);     
  this.timesubscription = timesource.subscribe(val => this.getTime());
  const temptimersource = interval(60000);     
  //this.tempOutsubscription = temptimersource.subscribe(val => this.getOutTemp()); 
  const hadatasource = interval(10000);     
  this.hasubscription = hadatasource.subscribe(val => this.getHaData()); 
}

//itemslist = []  // Array

line_marker: any

getHAWebApi(){
  (async () => {
    let auth;
    try {
      auth = await getAuth();
    } catch (err) {
      if (err === ERR_HASS_HOST_REQUIRED) {
        const hassUrl = prompt(
          "What host to connect to?",
          "http://192.168.1.10:8123"
        );
        if (!hassUrl) return;
        auth = await getAuth({ hassUrl });
      } else {
        alert(`Unknown error: ${err}`);
        return;
      }
    }
    const connection = await createConnection({ auth });
  
    subscribeEntities(connection, entities =>
      this.renderEntities(connection, entities)
    )
    
    // Clear url if we have been able to establish a connection
    if (location.search.includes("auth_callback=1")) {
      history.replaceState(null, "", location.pathname);
    }
 
    /*
    // To play from the console
    window.auth = auth;
    window.connection = connection;
    getUser(connection).then(user => {
      console.log("Logged in as", user);
      window.user = user;
      */
    subscribeEntities(connection, (entities) => console.log("New entities!", entities));

    });
  }
  //)
  //();
//}

renderEntities(connection, entities) {
  console.log("renderEntities")
}

getHaData() {
  // Remember to adjust Home Assistant to allow connections from localhost(cors)
  let sensors: string[] = [ 
    "sensor.emontxv3ehyoutdoor_humidity",
    "sensor.emontxv3ehybmp085_temperature",
    "sensor.emontx_uv_light",
    "sensor.gardenhouse_plant_moist",
    "binary_sensor.lawnmowerincharger", 
  ]

  sensors.forEach(havalue => {
    //console.log(havalue)
    this.haApi.getHAData(havalue).subscribe((x: string[]) => {
      var ent = x
      console.log("HAValue: " + havalue + ": " + ent)
      switch(havalue) {
        case "sensor.emontxv3ehybmp085_temperature": 
        {
          this.temp = ent
          console.log("TEMP: " + this.temp)
          x.forEach(element => {
            console.log("ent: " + element)            
          });
          break
        }
        case "binary_sensor.lawnmowerincharger":
        {
          this.updateLawnMowerState(ent);
        }
        default: {
          break
        }
      }
      //for ( var xs in  list) {
        //console.log("X: " + list)
      //}
  });
  //return haResult
  return "ent"
  })
}

updateLawnMowerState(lmState)
{
  console.log("lmState: " + lmState)
  if (lmState=="on") {
    this.lmStatus = "vilar."
  }
  else {
    this.lmStatus = "jobbar."
  }
  
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
          this.empList.forEach(element => {
            console.log(element.Summary + "-" + element.Creator)
            console.log(element.OrganizerDisplayName)
          });
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
/*
getOutTemp() {
  // Get data from Home Assistant
  // curl -X GET -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxYTI3YTgzN2QwYTU0OTA4OTFlMjExZmY0NTcxNDhmMyIsImlhdCI6MTU3MjE4ODc2NiwiZXhwIjoxODg3NTQ4NzY2fQ.j_YgyPqiQKcnJ0RYrjoYhk-VExslATh5GIo98tg6g50" -H "Content-Type: application/json" http://192.168.1.190:8123/api/states/sensor.emontxv3ehyhtu21d_temperature

  this.apiService.getTempOut().subscribe((data: {})=>{
    var tempData = data;
    this.tempOut = tempData['state']
    console.log("temp:" + this.tempOut);
  });
}
*/
loadPictures() {
  return this.PictureApi.getPictures().subscribe((data: {}) => {
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
