import { Component } from '@angular/core';
import { webSocket, WebSocketSubject} from 'rxjs/webSocket'; 
import { JsonConfig, myurls } from '../assets/config';
import { authToken } from '../assets/config';
import { Injectable } from '@angular/core';
/*
import { Observable, of } from 'rxjs';
import { formatDate, Time } from '@angular/common';
*/

class HadataClass {
  id: string;
  name: string;
  last_changed: string
}

var HAdataReturn: HadataClass[] = [];

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class HaData {
  title = 'Ang';
  myWebSocket: WebSocketSubject<any> = webSocket(myurls.haWSUrl);
  msg = ''
  elementState="0"
  entity_id=""
  state=""
  last_changed=""
  lawnmowerstate=""

  constructor() {}

  getHadata(): HadataClass[] {
    this.wsConnect()
    console.log("HadataClass - WS connected")
    connectToHa(this.myWebSocket)
    return HAdataReturn 
  }

  wsConnect(){
    this.myWebSocket.subscribe(
      //msg => console.log('message received: ' + msg),
      msg => this.answerFunc(msg),
      // Called whenever there is a message from the server
      err => console.log(err),
      // Called if WebSocket API signals some kind of error
      () => console.log('complete')
      // Called when connection is closed (for whatever reason)
    )
  }

  answerFunc(msg){
    //console.log("answerFunc")
    this.msg=msg
    if(msg.result != undefined) {
      // The whole result:
      //console.log(msg.result)
      msg.result.forEach(element => {
      console.log("HA elements " + element)  // See all elements
      // One selected entity:
        if ( element.entity_id == "sensor.emontxv3ehyhtu21d_temperature")
        {
          this.entity_id = element.entity_id
          this.state = element.state
          this.last_changed = element.last_changed
        }
        if ( element.entity_id == "binary_sensor.lawnmowerincharger")
        {
          if (element.state == "on") {
            this.lawnmowerstate = "vilar"
          }
          else {
            this.lawnmowerstate = "jobbar"
          }

        }
      });   
    }   
  }
}

function connectToHa(myWebSocket){
  console.log("connectToHa")
  var type = authToken.type
  var access_token = authToken.access_token
  const authTokenFull = {
    'type': type,
    'access_token': access_token
  };

  myWebSocket.next(authTokenFull)
  const req = 
  {
    'id': 19,
    'type': 'get_states'
  }
  myWebSocket.next(req)
}

