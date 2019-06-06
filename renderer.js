// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const powershell = require('node-powershell');
const { printersReader } = require('./printersReader')
const { playAudio, stopAudio } = require('./audio.js')

var data;

ready(() => {
    data = printersReader.f();
    populateLocations(data.locations);
    
    playAudio('win98-start.mp3');
})

let dropdown = document.getElementById("locationSelect");
dropdown.addEventListener('change', (event) => {
    let printers = data.locations[event.target.value].printers;
    populatePrinters(printers);
});

let installPrinterButton = document.getElementById('installPrinterButton');
installPrinterButton.addEventListener('click', (event) => {
    let locationIndex = document.getElementById('locationSelect').value;
    let selectedLocation = data.locations[locationIndex];
    let network = selectedLocation.network;
    let printerIndex = document.getElementById('printerSelect').value;
    let selectedPrinterName = selectedLocation.printers[printerIndex].name;
    let fullPrinterName = network + selectedPrinterName;
    console.log("Instalowana drukarka " + fullPrinterName);
    let setAsDefault = document.getElementById('makeDefaultPrinter').checked;
    installPrinter(fullPrinterName, setAsDefault);
});

function populateLocations(locations) {
    let dropdown = document.getElementById("locationSelect");
    for (let i = 0; i < locations.length; i++) {
        let option = document.createElement('option');
        option.text = locations[i].name;
        option.value = i;
        dropdown.add(option);
    }
    populatePrinters(locations[0].printers);
}

function populatePrinters(printers) {
    let printerSelect = document.getElementById('printerSelect')
    
    printerSelect.innerHTML = "";
    
    for (let i = 0; i < printers.length; i++) {
        let option = document.createElement('option');
        option.text = printers[i].name;
        option.value = i;
        printerSelect.add(option);
    }
}
let installButton = document.getElementById("installPrinterButton");
let progressSpinner = document.getElementById("progressSpinner");

function installPrinter(printerName, setAsDefault = false) {
    // Activate spiner
    document.getElementById("installPrinterButton").style.visibility = "visible";
    document.getElementById("loadingImage").style.visibility = "hidden";
    
    // Create the PS Instance
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })
    
    // Load the gun
    ps.addCommand(`add-printer -connectionname "${printerName}"`)
    if (setAsDefault) {
        ps.addCommand(`(New-Object -ComObject WScript.Network).SetDefaultPrinter('${printerName}')`);
    }
    disableButton(installButton, progressSpinner);

    // Pull the Trigger
    playAudio('printer.mp3')
    ps.invoke()
        .then(output => {
            console.log(`pr!ñt3r ${printerName} H4©K!ñg w4$ $u©©3$$ful`)

            //Hide spinner
            document.getElementById("installPrinterButton").style.visibility = "visible";
            document.getElementById("loadingImage").style.visibility = "hidden";
            stopAudio();
        })
        .catch(err => {
            console.error(err)
            ps.dispose()
        }).then(output => {
            enableButton(installButton, progressSpinner);
            stopAudio();
        })
}

function disableButton(button, spinner) {
    button.setAttribute("aria-disabled", "true");
    button.setAttribute("disabled", "true");
    button.classList.add("disabled");
    if (spinner) {
        spinner.removeAttribute("hidden");
    }
}

function enableButton(button, spinner) {
    button.removeAttribute("aria-disabled");
    button.removeAttribute("disabled");
    button.classList.remove("disabled");
    if (spinner) {
        spinner.setAttribute("hidden", "true");
    }
}

// MAC
// var exec = require('child_process').exec, child;

// child = exec(`lpadmin -p ${printer} -L "Warsaw" -E -v lpd://172.25.100.17 -P "/System/Library/Frameworks/ApplicationServices.framework/Versions/A/Frameworks/PrintCore.framework/Versions/A/Resources/Generic.ppd" -o printer-is-shared=false`,
//     function (error, stdout, stderr) {
//         console.log('stdout: ' + stdout);
//         console.log('stderr: ' + stderr);
//         if (error !== null) {
//             console.log('exec error: ' + error);
//         }
//     });
// child();


function ready(fn) {
    if (document.attachEvent
        ? document.readyState === "complete"
        : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
