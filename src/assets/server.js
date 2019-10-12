const express = require('express')
const app = express()
const port = 8000

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

eval(fs.readFileSync('index.js')+'');


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
