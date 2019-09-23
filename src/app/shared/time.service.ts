import { Injectable } from '@angular/core';
import { formatDate, Time } from '@angular/common';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  public now: Date = new Date();
  hmtime;  

  getTime(): Observable<any[]> {
    this.now = new Date();
    this.hmtime = formatDate(this.now, "HH:mm:ss", "en" );
    return of(this.hmtime);
  }
}
