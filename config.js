module.exports = {
    enableOfficeMaps: process.env.LPT_PRNT_OFFICE_MAPS,
    enableStartupSound: process.env.LPT_PRNT_STARTUP_SOUND,
    platform: {
        mac: navigator.platform.indexOf('Mac') > -1,
        win: navigator.platform.indexOf('Win') > -1
    }
}