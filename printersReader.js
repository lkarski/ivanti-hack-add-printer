module.exports = {
  printersReader: {
    f: function () {
      let printers;
      var request = new XMLHttpRequest();
      request.open('GET', 'http://slc-ldms.ld.landesk.com/landesk/files/Printers/Ivanti_printers.json', false); 
      request.send(null);
      if (request.status === 200) {
        console.log(request.responseText);
        printers = JSON.parse(request.responseText);
      }

      return printers;
    }
  }
};
