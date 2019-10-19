const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const express = require('express')
const cors = require('cors')

var calArray = []
var allEvents = []	// Array

var key = 'Events';
//o[key] = []; 
var jsonData
var cnt=0
var cidLen=0
var calChecked=0
var totalEvents=0
var evCnt=0

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = '/srv/http/nodejs/token.json';

// Set up server
const app = express()
app.use(express.static(__dirname));
app.use(cors());
const port = 8000

app.listen(port, function () {
  console.log('CORS-enabled web server listening on port 8080')
})

app.get('/', cors(), (req, res, next) => {
  //res.send('Hello World!');
  res.send(jsonData)
  //res.json({path: calArray})
})

function checkCreds (functionToCall, cids)
{
  console.log("Check credentials");
  //console.log("Func: " + functionToCall + "cid: " + cid);
  
  // Load client secrets from a local file.
  fs.readFile('/srv/http/nodejs/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  //authorize(JSON.parse(content), listEvents);

  switch (functionToCall) {
    case 'listCalendars':
        console.log('List calendars.');
        authorize(JSON.parse(content), listCalendars);        
        break;
    case 'listEvents':
        console.log('List events');
        //var id = '#daynum@group.v.calendar.google.com';
        //console.log(cids);


        cidLen = cids.length;
        console.log(cidLen + " calenders to check.")
        for (i = 0; i < cidLen; i++) {
          console.log("Check " + cids[i]);
          authorize(JSON.parse(content), listEvents, cids[i]);

        }
        break;
            
    default:
    console.log('gcal, function call error');
    console.log("functionToCall:" + this.functionToCall);
    //console.log("cid:" + cid); 
}
});
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, cid) {  // callback = listEvents or listCalendars
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  console.log("auth, id=" + cid)

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, cid);
    //console.log("auth done");
  });
}

function listCalendars(auth) {
	const calendar = google.calendar({version: 'v3', auth});
	calendar.calendarList.list({
	
	}, (err, res) => {
    	if (err) return console.log('The API returned an error: ' + err);
    	const cals = res.data.items;
	if (cals.length) {
      		console.log('Calendars:');		
      		console.log("Calendars found: " + cals.length);
          console.log(cals);
          /*
          for (x=0;x<cals.length;x++) {
            console.log(cals[x].summary);
            console.log(cals[x].id);
          };
          */
    	} else {
      		console.log('No calendars found.');
    	}
   });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

 
async function getData(functionToCall, cid) { // (1)
  console.log("jsonData, cid: " + cid + ", ftc: "+ functionToCall);
  try{
    response = await checkCreds(functionToCall, cid); // (2)
    console.log("Waiting for data");
  }
  catch{}
  console.log("Got data");
}



function serverData(events) {
  //console.log(events);   // Show all data
  console.log("In serverdata")

/*  
  console.log("cnt: " + cnt)
  calArray.push ("Event")
  calArray.push (cnt)
  calArray.push (events[0].summary)
  calArray.push (events[0].start.dateTime)
  calArray.push (events[0].end.dateTime)
  calArray.push (events[0].start.date)
  calArray.push (events[0].end.date)
*/
//  jsonData = JSON.stringify(calArray);

//o.push (key)
//var id = events[0].id
//console.log("-------" + events[0].id + "-------")
//o[calChecked] = []; 
//console.log("-------" + events + "----------")

//console.log("Length: " + events.length)
//console.log("cnt: " + cnt)

/*
Data ska vara ett object
allEvents ska vara en array
Lägg alla data-object i allEvents-arrayen
*/

for (var i = 0; i < events.length; i++) {
	// Here we list all events found in one calendar
	// This is run for every event found 
	evCnt++
	var data = {};	// Object	
	data.nr = evCnt
	data.summary = events[i].summary

/*
In allEvents:
  starttime: '2019-10-21T07:45:00+02:00',
  endtime: '2019-10-21T15:30:00+02:00',
  startdate: undefined,
  enddate: undefined,
---
  starttime: undefined,
  endtime: undefined,
  startdate: '2019-10-18',
  enddate: '2019-10-19',

if (typeof x === "undefined") {

In Json:
If time is noted:
"starttime":"2019-11-09T10:00:00+01:00",
"endtime":"2019-11-09T14:00:00+01:00",
All day event:
"startdate":"2019-11-26",
"enddate":"2019-11-27",
*/
	var startDT = events[i].start.dateTime
	if (typeof startDT === "undefined") { 
		// All day event
		console.log("startDT undefined")
		// The string format should be: YYYY-MM-DDTHH:mm:ss.sssZ, where:
		// let ms = Date.parse('2012-01-26T13:51:50.417-07:00');
		//var start = events[i].start.date + "T00:00:00.000+02:00

		var start = events[i].start.date + "T00:00:00Z"
		console.log("parse: " + parseISOLocal(start))

 		var end = events[i].end.date + "T23:59:59.000+02:00Z"
		console.log(start)
		
		console.log(Date.parse(start))	
		data.start = start 
		data.end = end
	}
	else { 
		data.start = events[i].start.dateTime
		data.end = events[i].end.dateTime
		
		//var res = start.split("T");


	}

	data.email = events[i].creator.email
	//allEvents.push("Event")
	allEvents.push(data)
	}

 	if (cnt===8) {
    		console.log("All calendars checked");
		// Sort by date		
		allEvents.sort(function(a, b) {
		    return (a.start < b.start) ? -1 : ((a.start > b.start) ? 1 : 0);
		});
		for (x in allEvents) {
		  console.log(allEvents[x]);
		}	

	jsonData = JSON.stringify(allEvents);
    	console.log("--------Found " +totalEvents + " events:" + jsonData)

  	}
}

function listEvents(auth, cid) {
    //console.log("----------listEvents, id=" + cid);
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
      //calendarId: 'primary',
      calendarId: cid,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err)
        return console.log('The API returned an error: ' + err);
        cnt++; // Count number of calendars checked
        const events = res.data.items;

      if (events.length) {
	//console.log("Checking " + cid)
        //console.log(events.length + " found.");
        serverData(events);
/*
        console.log('Upcoming 10 events:');
          events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(i);
          console.log(`${start} - ${event.summary}`);

        });
      */      }
      else {
        console.log('No upcoming events found.');
      }
    	console.log("Done2");
	totalEvents = totalEvents + events.length
	console.log("total: " + totalEvents)
    	calChecked++
    });
  //
}

function listAllEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function parseISOLocal(s) {
  var b = s.split(/\D/);
  return new Date(b[0], b[1]-1, b[2], b[3], b[4], b[5]);
}

module.exports = {
  //matrixMake,
  getData,
  checkCreds
};
