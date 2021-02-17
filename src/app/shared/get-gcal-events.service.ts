import { Injectable } from '@angular/core';
 
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { JsonConfig, myurls } from '../../assets/config';

@Injectable()
export class GcalService {
 
  gcalUrl: string = "http://192.168.1.15:8080/api/GcalItems/getevents"
 
  constructor(private http: HttpClient) {
  }
 
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      method: 'GET', // GET, POST, PUT, DELETE
      mode: 'no-cors' // the most important option
    })
  }  

  getcalEvents(): Observable<any> {
    //return this.http.get(this.gcalUrl)
    var res = this.http.get(myurls.gcalUrl)
    //console.log("RES: " + res)
    return res
  }
 
}