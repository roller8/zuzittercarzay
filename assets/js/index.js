var timer;
var $startButton;
var tempo       = 60;
var minuteToMil = 60000;
var subdivision = 4;
var interval    = Math.round((minuteToMil / tempo) / subdivision);
var swing       = false;
var monoAudio   = new Audio();
var charlieAudio = new Audio();

var sounds      = {
    'kick': {
        'src': 'samples/drums/kick1.wav',
        'volume': 1
    },
    'snare': {
        'src': 'samples/drums/snare7.wav',
        'volume': 1
    },
    'clap': {
        'src': 'samples/drums/clap3.wav',
        'volume': 0.5
    },
    'clHat': {
        'src': 'samples/drums/closedhh2.wav',
        'volume': 0.5
    },
    'opHat': {
        'src': 'samples/drums/openhh1.wav',
        'volume': 0.6
    },
    'yeah': {
        'src': 'samples/smb_fireball.wav',
        'volume': 0.7
    },
    'feel': {
        'src': 'samples/smb_fireworks.wav',
        'volume': 0.5
    },
    'check': {
        'src': 'samples/smb_jump-super.wav',
        'volume': 0.7
    },
    'here': {
        'src': 'samples/smb_kick.wav',
        'volume': 0.7
    },
    'oww': {
        'src': 'samples/smb_pipe.wav',
        'volume': 0.5
    },
    'woo': {
        'src': 'samples/smb_powerup_appears.wav',
        'volume': 0.5
    },
    'hiTom': {
        'src': 'samples/smb_powerup.wav',
        'volume': 0.5
    },
    'midTom': {
        'src': 'samples/smb_coin.wav',
        'volume': 0.5
    },
    'loTom': {
        'src': 'samples/smb_mariodie.wav',
        'volume': 1
    },
    'cowbell': {
        'src': 'samples/smb_world_clear.wav',
        'volume': 0.6
    },
    'kazoo': {
        'src': 'samples/kazoo.wav',
        'volume': 0.6
    },
    'charlie': {
        'src': 'samples/circus-charlie.m4a',
        'volume': 0.6
    }
};

var pattern     = [
    {'name': 'kick',    'seq': [1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]},
    {'name': 'snare',   'seq': [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
    {'name': 'clap',    'seq': [0,0,0,0,1,1,0,0,1,0,0,1,0,0,1,0]},
    {'name': 'clHat',   'seq': [1,0,1,0,1,0,1,0,0,1,0,1,1,0,1,0]},
    {'name': 'opHat',   'seq': [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1]}
];

function initAudioPlayer() {
    setObjReference();
    handleStartStop();
    handleVolInput();
    bindDrumKeys();
    togglePattern();
    handleSwing();
    initMidiControls();3
}

function setObjReference() {
    $startButton    = $('.start-stop').find('button');

    $('.simple-button').each(function(i, elt) {
        elt.addEventListener('click', function(e) {
            $(e.currentTarget).toggleClass('active');

            if (elt.className.match(/(^| )kick( |$)/)) trigger(sounds.kick);
            else if (elt.className.match(/(^| )snare( |$)/)) trigger(sounds.snare);
            else if (elt.className.match(/(^| )clhat( |$)/)) trigger(sounds.clHat);
            else if (elt.className.match(/(^| )ophat( |$)/)) trigger(sounds.opHat);
            else if (elt.className.match(/(^| )clap( |$)/)) trigger(sounds.clap);
        });
    });
}

function handleSwing() {
    $('.swing').on('click', 'button', function () {
        $(this).toggleClass('active');
        swing = !swing;
    });
}

function loadPattern() {
    $('.row').each(function (index, elem) {
        $(elem).find('button').each(function (i, el) {
            if (pattern[index].seq[i] === 1) {
                $(el).addClass('active');
            }
        });
    });
}

function togglePattern() {
    loadPattern();
    $('.toggle-pattern').on('click', 'button', function () {
        var $this = $(this);
        $this.toggleClass('active');
        if ($this.hasClass('active')) {
            loadPattern();
        } else {
            $('.row').find('button').removeClass('active');
        }
    });
}

function handleStartStop() {
    var count = 0;

    $startButton.on('click', function(e) {
        var init = new Date().getTime();
        $(e.currentTarget).toggleClass('active');
        handleTempo(init);
        if ($startButton.hasClass('active')) {
            $('.glow').removeClass('hide');
            loop();
        } else {
            clearTimeout(timer);
            count = 0;
            $('.glow').addClass('hide');
            $('.simple-button').removeClass('on');
        }

        function loop() {
            timer = setTimeout(function() {
                var init2 = new Date().getTime();
                if (count === subdivision * 4) count = 0;
                playSubdiv(count);
                handleTempo(init2);
                count++;
                loop();
            }, interval);
        }
    });
}

function handleTempo(init) {
    var diff = new Date().getTime() - init;

    tempo = $('.tempo').find('input').val();
    interval = Math.round((minuteToMil / tempo) / subdivision - diff);
}

function handleVolInput() {
    document.onkeydown = function (e) {
        e = e || window.event;

        var $input = $('.tempo').find('input');
        var volume = Number($input.val());

        switch (e.keyCode) {
            case 38: // up arrow
                tempo = volume + 1;
                $input.val(tempo);
                break;
            case 40: // down arrow
                tempo = volume - 1;
                $input.val(tempo);
                break;
            case 37: // left arrow
               tempo = volume - 1;
               $input.val(tempo);
               break;
            case 39:  // right arrow
               tempo = volume + 1;
               $input.val(tempo);
               break;
        }
    };
}

function bindDrumKeys() {
    window.addEventListener("keydown", function() {
        if ($('.tempo input').is(':focus')) return;
        switch (window.event.keyCode) {
            case 192:
                triggerMono(sounds.kazoo);
                break;
            case 49:
                trigger(sounds.here);
                break;
            case 50:
                trigger(sounds.yeah);
                break;
            case 51:
                trigger(sounds.feel);
                break;
            case 52:
                trigger(sounds.check);
                break;
            case 53:
                trigger(sounds.midTom);
                break;
            case 54:
                triggerMono(sounds.hiTom);
                break;
            case 55:
                triggerMono(sounds.woo);
                break;
            case 56:
                triggerMono(sounds.oww);
                break;
            case 57:
                triggerMono(sounds.loTom);
                break;
            case 48:
                triggerMono(sounds.cowbell);
                break;
            case 189:
                triggerCircus(sounds.charlie);
                break;
            case 187:
                stopCircus(charlieAudio);
                break;
            case 32:
                $startButton.click();
                break;
        }
    });
}

function triggerMono(sound, count) {
    monoAudio.src       = sound.src;
    monoAudio.volume    = sound.volume;

    playSound(monoAudio);
}

function trigger(sound, count) {
    var audio       = new Audio();
    audio.src       = sound.src;
    audio.volume    = sound.volume;

    if (swing && (count % 2 === 1)) {
        setTimeout(function () {
            playSound(audio); //delayed trigger
        }, interval/(Math.random() * 3 + 2));
    } else {
       playSound(audio); //normal
    }
}

function triggerCircus(sound) {
    charlieAudio.src    = sound.src;
    charlieAudio.volume = sound.volume;

    playSound(charlieAudio);
}

function playSound(audio) {
    var $glow = $('.glow');


    audio.play();
    $glow.removeClass('hide');

    setTimeout(function () {
        $glow.addClass('hide');
    }, interval - 5);
}

function stopCircus(audio) {
    var $glow = $('.glow');

    charlieAudio.pause();
    $glow.removeClass('hide');

    setTimeout(function () {
        $glow.addClass('hide');
    }, interval - 5);
}

function playSubdiv(count) {
    var rows = document.getElementsByClassName('row');

    for (var i = 0; i < rows.length; i++) {
        var buttons = rows[i].getElementsByClassName('simple-button');
        $(buttons).removeClass('on').eq(count).each(function (index, elt) {
            if (elt.className.match(/(^| )active( |$)/)) {
                if (elt.className.match(/(^| )kick( |$)/)) trigger(sounds.kick, count);
                else if (elt.className.match(/(^| )snare( |$)/)) trigger(sounds.snare, count);
                else if (elt.className.match(/(^| )clhat( |$)/)) trigger(sounds.clHat, count);
                else if (elt.className.match(/(^| )ophat( |$)/)) trigger(sounds.opHat, count);
                else if (elt.className.match(/(^| )clap( |$)/)) trigger(sounds.clap, count);
            }
            $(elt).addClass('on');
        });
    }
}


// midi functions
var midi, data, outputs;

function initMidiControls() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
            sysex: false
        }).then(onMIDISuccess, onMIDIFailure);
    } else {
        alert("No MIDI support in your browser.");
    }
}

function onMIDISuccess(midiAccess) {
    midi = midiAccess;
    var inputs = midi.inputs.values();
    outputs = midi.outputs.values();

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = onMIDIMessage;
    }
    // var counter = 0;
    // for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
    //     output.value.onmidimessage = onMIDIMessage;
    //     // counter += 1;
    //     // output.value.send([0x90, counter, 0x7f]);

    //     console.log(output);
    // }

    // console.log(midi.outputs);

    // outputs[1].value.send([0x90, counter, 0x7f]);
    // outputs[0].value.send([0x90, counter, 0x7f]);

    midi.onstatechange = onStateChange;
}

function onMIDIFailure(e) {
    log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}

function onMIDIMessage(event) {
    data = event.data,
    cmd = data[0] >> 4,
    channel = data[0] & 0xf,
    type = data[0] & 0xf0,
    note = data[1],
    velocity = data[2];
    // // with pressure and tilt off
    // // note off: 128, cmd: 8
    // // note on: 144, cmd: 9
    // // pressure / tilt on
    // // pressure: 176, cmd 11:
    // // bend: 224, cmd: 14

    if (velocity > 0) {
        switch (note) {
            case 0:
                triggerMono(sounds.kick);
                break;
            case 1: // noteOn message
                triggerMono(sounds.snare);
                break;
            case 2: // noteOn message
                triggerMono(sounds.clap);
                break;
            case 3: // noteOn message
                triggerMono(sounds.clHat);
                break;
            case 4: // noteOn message
                triggerMono(sounds.opHat);
                break;
            case 16: // noteOn message
                triggerMono(sounds.kazoo);
                break;
            case 17: // noteOn message
                triggerMono(sounds.here);
                break;
            case 18: // noteOn message
                triggerMono(sounds.yeah);
                break;
            case 19: // noteOn message
                triggerMono(sounds.feel);
                break;
            case 20: // noteOn message
                triggerMono(sounds.check);
                break;
            case 21: // noteOn message
                triggerMono(sounds.midTom);
                break;
            case 22: // noteOn message
                triggerMono(sounds.hiTom);
                break;
            case 23: // noteOn message
                triggerMono(sounds.woo);
                break;
            case 32: // noteOn message
                triggerMono(sounds.oww);
                break;
            case 33: // noteOn message
                triggerMono(sounds.loTom);
                break;
            case 34: // noteOn message
                triggerMono(sounds.cowbell);
                break;
            case 104: // noteOn message
                triggerCircus(sounds.charlie);
                break;
            case 120: // noteOn message
                stopCircus(charlieAudio);
                break;
            case 8:
                $startButton.click();
                break;
        }
    }

    console.log('data', data, 'cmd', cmd, 'channel', channel, 'note', note);
    // logger(keyData, 'key data', data);
}

// function noteOn(midiNote, velocity) {
//     player(midiNote, velocity);
// }

// function noteOff(midiNote, velocity) {
//     player(midiNote, velocity);
// }

function player(note, velocity) {
    console.log('trying to play!');
    // var sample = sampleMap['key' + note];
    // if (sample) {
    //     if (type == (0x80 & 0xf0) || velocity == 0) { //QuNexus always returns 144
    //         btn[sample - 1].classList.remove('active');
    //         return;
    //     }
    //     btn[sample - 1].classList.add('active');
    //     btn[sample - 1].play(velocity);
    // }
}

function onStateChange(event) {
    var port  = event.port;
    var state = port.state;
    var name  = port.name;
    var type  = port.type;

    if (type == "input") {
        console.log("name", name, "port", port, "state", state);
    }
}

window.addEventListener("load", initAudioPlayer);
