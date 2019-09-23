import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { RestApiService } from "./shared/picturesGet";
import { TimeService } from "./shared/time.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-httpclient-app';
  Pictures: any = [];
  timeNow: any = [];
  picsubscription: Subscription;
  timesubscription: Subscription;

  constructor(    
    public restApi: RestApiService,
    public TimeApi: TimeService
    ) { }

ngOnInit() {
  this.loadPictures()
  this.getTime();
  const picsource = interval(5000);  
  this.picsubscription = picsource.subscribe(picval => this.loadPictures());

  const timesource = interval(1000);     
  this.timesubscription = timesource.subscribe(val => this.getTime()); 
}

item: any;
loadPictures() {
  return this.restApi.getPictures().subscribe((data: {}) => {
    this.Pictures = data;
    for (this.item in this.Pictures) {
      //console.log(this.Pictures.path + "-" + this.Pictures.filename);
      console.log(this.item);
    }
  })
}
getTime() {
  return this.TimeApi.getTime().subscribe((data: {}) => {
    this.timeNow = data;
    //console.log("Time: " + this.timeNow);
  })
}
}
