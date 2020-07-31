import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TempApiService {

  constructor(private httpClient: HttpClient) { }

  public getTempOut(){
/*    return this.httpClient.get('http://192.168.1.190:8123/api/states/sensor.emontxv3ehyhtu21d_temperature', {
      headers: {
        'Authorization': ' .eyJpc3MiOiIxYTI3YTgzN2QwYTU0OTA4OTFlMjExZmY0NTcxNDhmMyIsImlhdCI6MTU3MjE4ODc2NiwiZXhwIjoxODg3NTQ4NzY2fQ.j_YgyPqiQKcnJ0RYrjoYhk-VExslATh5GIo98tg6g50',
    }
    */
/*
   const  headers = new  HttpHeaders().set
   ("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxYTI3YTgzN2QwYTU0OTA4OTFlMjExZmY0NTcxNDhmMyIsImlhdCI6MTU3MjE4ODc2NiwiZXhwIjoxODg3NTQ4NzY2fQ.j_YgyPqiQKcnJ0RYrjoYhk-VExslATh5GIo98tg6g50"
      );
   //headers.append("Content-Type", "application/json")  
   //headers.append("Access-Control-Allow-Origin", "*");
 
   return this.httpClient.get('http://192.168.1.10:8123/api/states/sensor.emontxv3ehyhtu21d_temperature', {headers})
    //this.customersObservable = this.httpClient.get("http://127.0.0.1:3000/customers", {headers});
  */    };
  
  }

