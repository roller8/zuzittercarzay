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
    handleSoundBanks();
    setObjReference();
    handleStartStop();
    handleVolInput();
    bindDrumKeys();
    handleSwing();
    handleRandomFloat();
    togglePattern();
}

function handleRandomFloat() {
    var $banks = $('.bank');
    function loopMe() {
        console.log('hello');
    }
    setInterval(loopMe, 1000);
}

function handleSoundBanks() {
    var $bank = $('.bank');
    var $row = $('.row');
    
    $bank.on('click', function(e) {
        e.preventDefault();
        var $target = $(e.target);
        var index = $bank.index($target);
        $row.addClass('hide').eq(index).toggleClass('hide');
        $target.addClass('active').siblings('.active').removeClass('active');
        $target.css({
            'animation-duration': (30/tempo)+ 's'
        });
    });
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
            if (pattern[index] && pattern[index].seq[i] === 1) {
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
            $('.glow').addClass('rotate');
            $('.jumper').addClass('jumping');
            loop();
        } else {
            clearTimeout(timer);
            count = 0;
            $('.glow').removeClass('rotate');
            $('.jumper').removeClass('jumping');
            $('.bank').removeClass('active');
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
    var $jumper = $('.jumper');
    var $activeBank = $('.bank.active');

    audio.play();
    $glow.css({
        'animation-duration': 60/tempo + 's'
    });
    $jumper.css({
        'animation-duration': (60/tempo) * 4+ 's'
    });
    $activeBank.css({
        'animation-duration': (30/tempo)+ 's'
    });
}

function stopCircus(audio) {

    charlieAudio.pause();

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

window.addEventListener("load", initAudioPlayer);
