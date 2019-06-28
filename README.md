# Ivanti - Install Printer

TO BUILD APP WITH electron-builder (https://www.electron.build/)

1. Install node.js https://nodejs.org/en/
3. Clone repo https://github.com/lkarski/ivanti-hack-add-printer
4. Run `npm install` in the app root directory
5. Run `npm run dist` in root directory

THATS IT.
Your app should be in `.\output`

To build Mac version you need to repeat it on Mac.


### Data & Config 

The app requires `Ivanti_printers.json` to be present in a specific location to
load data and config.

The structure of that file is as follows:
```
{
    "locations": 
    [
        {
            "name": "Warsaw",
            "network": "\\\\warsaw.location.shared.folder\\",
            "address": "network base ip address",
            "printers": [
                {
                    "name": "printer name",
                    "address": "printer address"
                },
                // more printers here...
            ]
        },
        // more locations here...
    ],
    "config":
    {
        "enableOfficeMaps": false,
        "enableStartupSound": false,
        "enableGeoLocation": false,
        "enablePrintTestPage": false
    }
}
```