import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { pictures } from './pictures';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  apiURL = "http://192.168.1.7/newPhotoFrame/pics.php";
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  getPictures(): Observable<pictures> {
    return this.http.get<pictures>(this.apiURL)
    .pipe(
      retry(1),
      catchError(this.handleError)
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
      console.log(errorMessage);
      //window.alert(errorMessage);
      return throwError(errorMessage);
   }
}
