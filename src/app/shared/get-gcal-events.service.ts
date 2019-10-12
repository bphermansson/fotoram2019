import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { gcalevents } from './gcalevents';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CONFIG } from '../../assets/settings';


@Injectable({
  providedIn: 'root'
})
export class GcalService {
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  getGcalEvents(): Observable<gcalevents> {
    return this.http.get<gcalevents>(CONFIG.gcalUrl)
    .pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

    // Error handling 
    handleError(error) {
      let errorMessage = '';
      if(error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
      } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.log("Err: " + errorMessage);
      //window.alert(errorMessage);
      return throwError(errorMessage);
   }
}
