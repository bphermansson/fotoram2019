//eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyYmI0NzhjNjhjYjc0ZjcwYWNmMDJhYTc3OTU3OGY3OCIsImlhdCI6MTU4OTQ4ODI2MywiZXhwIjoxOTA0ODQ4MjYzfQ.xPnMwiJYFv5ZE8av9lveNB0kJyeoPZVvI9MnKmuJuqM

/*
 curl -X GET -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhOTkyOGMwYTkxMTM0ZjdjYjAxNGRkOWY4YmE2OWE4NyIsImlhdCI6MTU5MDMzMDc3MSwiZXhwIjoxOTA1NjkwNzcxfQ.4KcUtRzIGm8Ar3umfZPGfxvoe8dzFTJZJCKbfui-0_s" -H "Content-Type: application/json" http://192.168.1.10:8123/api/states

http://192.168.1.10:8123/api/states/sensor.washerhumidity


*/
// https://www.positronx.io/handle-cors-in-angular-with-proxy-configuration/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { CONFIG } from '../../assets/settings';
import { retry, catchError, map } from 'rxjs/operators';
import { Identifiers } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})

class HaClass {
  id: number;
  name: string;
}

export class HADataService {
  constructor(private http: HttpClient) { }
    getHAData(sensor): Observable<any> {
      var reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhOTkyOGMwYTkxMTM0ZjdjYjAxNGRkOWY4YmE2OWE4NyIsImlhdCI6MTU5MDMzMDc3MSwiZXhwIjoxOTA1NjkwNzcxfQ.4KcUtRzIGm8Ar3umfZPGfxvoe8dzFTJZJCKbfui-0_s',
      })

      var haURL = CONFIG.haurl;
      console.log("Get: " + sensor + " from " + haURL)
      return this.http.get(haURL + sensor,{headers: reqHeader})        
    }
      private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
          'Something bad happened; please try again later.');
      };
}
