// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs')
const powershell = require('node-powershell')
const { getPrinters } = require('./get-printers')
const { playAudio, stopAudio } = require('./audio.js')
const { getUserIP } = require('./checkIP.js')
const config = require('./config') 

const data = getPrinters()
const costam = [];
getUserIP(function (ip) {
    costam.push(splitIP(ip))
})


const username = process.env.username || process.env.user || process.env.USER;

ready(() => {
    console.log('config', config)

    if (config.enableStartupSound) { playAudio('win98-start.mp3') }
    populateLocations(data.locations)
    findLocation(data.locations)
    showOfficeMap(data.locations[0])
    greet(username)

    if (config.platform.win) {
        getGeoLocation()
            .then(geo => showGeoLocation(geo))
    }

    if (config.platform.win) { turnOnPrintTestPage() }

    showEnvironmentInfo()
})

let dropdown = document.getElementById("locationSelect");

dropdown.addEventListener('change', (event) => {
    let location = data.locations[event.target.value]
    let printers = location.printers

    populatePrinters(printers);
    blockPrintTestPage();
    showOfficeMap(location)
});

let printersDropdown = document.getElementById("printerSelect");
printersDropdown.addEventListener('change', (event) => {
    blockPrintTestPage();
});

function getSelectedPrinterName() {
    let locationIndex = document.getElementById('locationSelect').value;
    let selectedLocation = data.locations[locationIndex];
    let network = selectedLocation.network;
    let printerIndex = document.getElementById('printerSelect').value;
    let selectedPrinterName = selectedLocation.printers[printerIndex].name;
    let fullPrinterName = network + selectedPrinterName;
    return fullPrinterName
}

let installPrinterButton = document.getElementById('installPrinterButton');
installPrinterButton.addEventListener('click', (event) => {
    let fullPrinterName = getSelectedPrinterName();
    console.log("installing printer: " + fullPrinterName);
    let setAsDefault = document.getElementById('makeDefaultPrinter').checked;


    if (config.platform.mac) {
        installPrinterOnMac(selectedPrinterName, network, setAsDefault);
    } else if (config.platform.win) {
        installPrinterOnWindows(fullPrinterName, setAsDefault);
    }
});

printTestPageButton.addEventListener('click', (event) => {
    let printingSpinner = document.getElementById('printingSpinner');

    console.log("printing test page");
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    });
    let fullPrinterName = getSelectedPrinterName();
    ps.addCommand(`./print.ps1 -Printer "${fullPrinterName}"`);
    playAudio("printer.mp3");
    disableButton(null, printingSpinner);
    ps.invoke()
        .then(output => {
            console.log(output);
            enableButton(null, printingSpinner);
            stopAudio();
        })
        .catch(err => {
            enableButton(null, printingSpinner);
            console.error(err);
            stopAudio();
            ps.dispose();
        })
});

function showGeoLocation(geo) {
    let div = document.getElementById('geoLocation')
    let geoAddress = document.getElementById("geoAddress")
    let geoMisc = document.getElementById("geoMisc")
    
    console.log(geo)
    geoAddress.innerHTML = `${geo.city}, ${geo.country}, ${geo.address26}`
    geoMisc.innerHTML = `${geo.building}, ${geo.neighbourhood}`
    div.classList.remove('d-none')
}

function getGeoLocation() {
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })

    // Load the gun
    ps.addCommand('./get-location')

    // Pull the Trigger
    return ps.invoke()
        .then(output => {
            try {
                return JSON.parse(output)
            }
            catch (error) {
                console.log(error)
            }
        })
        .catch(err => {
            console.error(err)
            ps.dispose()
        })
}

function greet(username) {
    hi = document.getElementById('hi')
    let name = username.split('.')[0] || 'Dear Sir/Madam'
    hi.innerHTML = `Hi ${name},`
}

function blockPrintTestPage() {
    let button = document.getElementById("printTestPageButton");
    disableButton(button);
}

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

function showOfficeMap(location) {
    if (!config.enableOfficeMaps) return;

    let img = document.getElementById('office-map-img')
    let div = document.getElementById('office-map')
    let imgFile = `assets/office-map-${location.name}.png`
    if (fs.existsSync(imgFile)) {
        img.src = imgFile
        div.classList.remove('d-none')
    }
    else {
        div.classList.add('d-none')
    }
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

function installPrinterOnWindows(printerName, setAsDefault = false) {
    let installButton = document.getElementById("installPrinterButton");
    let progressSpinner = document.getElementById("progressSpinner");
    // Activate spiner
    document.getElementById("installPrinterButton").style.visibility = "visible";
    document.getElementById("loadingImage").style.visibility = "hidden";

    let printTestPageButton = document.getElementById("printTestPageButton");

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
            enableButton(printTestPageButton);
        })
}

function turnOnPrintTestPage() {
    let button = document.getElementById("printTestPageButton");
    button.classList.remove("d-none");
}

function disableButton(button, spinner) {
    if (button) {
        button.setAttribute("aria-disabled", "true");
        button.setAttribute("disabled", "true");
        button.classList.add("disabled");
    }
    if (spinner) {
        spinner.removeAttribute("hidden");
    }
}

function enableButton(button, spinner) {
    if (button) {
        button.removeAttribute("aria-disabled");
        button.removeAttribute("disabled");
        button.classList.remove("disabled");
    }
    if (spinner) {
        spinner.setAttribute("hidden", "true");
    }
}

function installPrinterOnMac(printer, network, setAsDefault = false) {
    let exec = require('child_process').exec, child;

    child = exec(`lpadmin -p ${printer} -L "Warsaw" -E -v lpd:${network} -P "/System/Library/Frameworks/ApplicationServices.framework/Versions/A/Frameworks/PrintCore.framework/Versions/A/Resources/Generic.ppd" -o printer-is-shared=false`,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    child();
}


function ready(fn) {
    if (document.attachEvent
        ? document.readyState === "complete"
        : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function splitIP(ip) {
    let splitIP = ip.split(/\./)
    return splitIP[0] + "." + splitIP[1]
}


function findLocation(locations) {
    setTimeout(() => {
        for (let i = 0; i < locations.length; i++) {
            console.log("add: " + splitIP(locations[i].address))
            if (locations[i].address && costam.includes(splitIP(locations[i].address))) {
                let dropdown = document.getElementById("locationSelect");
                dropdown.selectedIndex = i;
                populatePrinters(locations[i].printers);
                blockPrintTestPage();
                showOfficeMap(locations[i])
            }
        }
    }, 2000);
}

function showEnvironmentInfo() {
    let info = document.getElementById('envInfo')
    info.innerHTML = `Running on Node.js ${process.versions.node}, Chromium ${process.versions.chrome}, and Electron ${process.versions.electron}`
}