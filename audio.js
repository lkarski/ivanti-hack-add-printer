'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
    playAudio,
    stopAudio
}

var context;
var music;

function playAudio(assetFileName) {
    context = new AudioContext();
    var p = path.join(__dirname, 'assets', assetFileName);
    fs.readFile(p, function (err, data) {
        if (err) {
            return console.error(err);
        }
        context.decodeAudioData(data.buffer)
            .then(audioBuffer => playBuffer(audioBuffer))
    });
}

function playBuffer(audioBuffer) {
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
    music = source;
}

function stopAudio() {
    music.stop();
}