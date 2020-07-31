import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Component} from '@angular/core';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HADataService } from './shared/hadata.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { GcalService } from './shared/get-gcal-events.service';


import {
  IMqttMessage,
  MqttModule,
  IMqttServiceOptions
} from 'ngx-mqtt';
import { TempComponent } from './temp/temp.component';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: '192.168.1.190',
  port: 9001,
  path: '/mqtt'
};

@NgModule({
  declarations: [
    AppComponent,
    TempComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    MatProgressBarModule
  ],
  providers: [HADataService, GcalService],
  bootstrap: [AppComponent],
  schemas: [ 
    //CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
/*
@Component({
  //selector: 'progress-bar-determinate-example',
  //templateUrl: 'progress-bar-determinate-example.html',
  //styleUrls: ['progress-bar-determinate-example.css'],
})
*/
//export class ProgressBarDeterminateExample {}