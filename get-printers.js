'use strict';

const fs = require('fs')
const path = require('path')

module.exports = {
  getPrinters
};

const URL = 'http://slc-ldms.ld.landesk.com/landesk/files/Printers/Ivanti_printers.json'

function getPrinters() {
  // return getPrintersLocal()

  let printers;
  var request = new XMLHttpRequest();
  request.open('GET', URL, false);
  request.send(null);
  if (request.status === 200) {
    // console.log(request.responseText);
    printers = JSON.parse(request.responseText);
  }

  return printers;
}

function getPrintersLocal(fileName = 'Ivanti_printers.json') {
  var p = path.join(__dirname, fileName)
  let data = fs.readFileSync(p)
  let json = JSON.parse(data)
  console.log('JSON', json)
  return json
}