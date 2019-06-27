module.exports = {
    configure
}

function configure(config) {
    return {
        ...config,
        platform: {
            mac: navigator.platform.indexOf('Mac') > -1,
            win: navigator.platform.indexOf('Win') > -1
        },
    }
}