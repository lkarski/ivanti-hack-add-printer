module.exports = {
  printersReader: {
    f: function () {
        let printers = require('./printers.json');
       // console.log("%j" ,printers.locations[0]);
        return printers;
    }
  }
};
  