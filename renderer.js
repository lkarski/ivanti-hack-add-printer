// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const powershell = require('node-powershell');

// Create the PS Instance
let ps = new powershell({
    executionPolicy: 'Bypass',
    noProfile: true
})

let printer = '\\\\pol-file.ld.landesk.com\\POL-Support'

// Load the gun
ps.addCommand(`add-printer -connectionname ${printer}`)

// Pull the Trigger
ps.invoke()
    .then(output => {
        console.log(`pr!ñt3r ${printer} H4©K!ñg w4$ $u©©3$$ful`)
    })
    .catch(err => {
        console.error(err)
        ps.dispose()
    })



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