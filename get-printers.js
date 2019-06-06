module.exports = {
  getPrinters
};

const URL = 'http://slc-ldms.ld.landesk.com/landesk/files/Printers/Ivanti_printers.json'

function getPrinters() {
  let printers;
  var request = new XMLHttpRequest();
  request.open('GET', URL, false);
  request.send(null);
  if (request.status === 200) {
    console.log(request.responseText);
    printers = JSON.parse(request.responseText);
  }

  return printers;
}
