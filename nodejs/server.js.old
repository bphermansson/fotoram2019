/* Run "node server.js" from the command line to auth
Then 'node server.js e' to list events or node server.js c" to list calendars you can see.
You have to set the calendars to view events for in var 'cids' below.

 Based on https://developers.google.com/calendar/quickstart/nodejs
 Needs express: npm install express --save
 https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04#step-3-%E2%80%94-installing-pm2

pm2 stop 0
pm2 server.js

*/

const port = 8000

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

gcal = require("./gcal.js")

console.log("All set up")

var myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);

var functionToCall;
switch (myArgs[0]) {
    case 'c':
        console.log(myArgs[1], 'List calendars.');
        functionToCall = "listCalendars";
        break;
    case 'e':
        console.log(myArgs[1], 'List events');
        functionToCall = "listEvents";
        break;            
    default:
        //console.log('Sorry, that is not something I know how to do.');
        // Use this as default when running with pm2.
        console.log(myArgs[1], 'List events');
        functionToCall = "listEvents";
        break; 
}

    //var cid = '#daynum@group.v.calendar.google.com';
    var cids = [];
    cids[0] = "lillplutt80@gmail.com";
    cids[1] = "h2n06olo7qjs40r5mu6v0335t4@group.calendar.google.com";	// Sabina 
    cids[2] = "7rpj1e8jg4qrovnofredugd6ek@group.calendar.google.com";	// Paheco
    cids[3] = "hermansson.patrik@gmail.com";
    cids[4] = "family16368741993989974284@group.calendar.google.com";
    cids[5] = "5rmmqeg98hkobeu2et6neifn7s@group.calendar.google.com";	// Oskar
    cids[6] = "f17nko395edd35sp35d5h9ec4tpbf7hl@import.calendar.google.com";	//Patrik Facebook events
    cids[7] = "angel_h80@hotmail.com";

    gcal.checkCreds(functionToCall, cids);
    

//app.get('/', (req, res) => res.send('Hello World!'))
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))

/*
function getData(functionToCall, cid) {
    console.log("getData, cid: " + cid + ", ftc: "+ functionToCall);
    return gcal.getData(functionToCall, cid);
}
*/
/*
async function asyncCall(functionToCall) {
    console.log("Async called");
    console.log(functionToCall);
    //var output = await gcal.checkCreds.call('temp', functionToCall, cid);
   // return gcal.checkCreds.call('temp', functionToCall, cid);
    
    return gcal.jsonData.call('temp', functionToCall, cid);

    //console.log("Async done");
    
    //console.log("Output: " + output);
}
*/
