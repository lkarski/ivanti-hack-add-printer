// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const powershell = require('node-powershell');

    // Create the PS Instance
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })

    // Load the gun
    ps.addCommand("./node-version", [
        { GigaWatts: 1.0 }
    ])

    // Pull the Trigger
    ps.invoke()
    .then(output => {
        console.log(output)
    })
    .catch(err => {
        console.error(err)
        ps.dispose()
    })
