console.log("loaded")
var interval
const subtimer = {
    time: 0,

    last_tick: 0,
    interval: 0,
    length: 0,
    tick: function () {
        this.tick.bind(this)
        let s = Math.round(Date.now() / 1000);
        if (s > this.last_tick) {
            this.time += 1;
            updateClock(this.time)
            if (this.time > this.length) {
                this.timeout()
            }
        };


        this.last_tick = s;

    },
    start: function (t) {
        let tick = this.tick.bind(this)
        this.length = t
        interval = setInterval(tick, 250)
        $("#subtimer_start_button").hide('fast')
        $("#subtimer_view").show()
    },
    stop: function () {
        clearInterval(interval)
        $("#subtimer_time").text("00:00")
    },
    timeout: function () {
        if (prefs.subtimer_pass_fail) {
            this.fail()
        } else {
            var audio = document.getElementById("subtimer_fail_audio");
            audio.play()
            this.stop()
        }
    },
    fail: function () {
        //play fail audio
        var audio = document.getElementById("subtimer_fail_audio");
        audio.play()
        this.stop()
    },
    pass: function () {
        var audio = document.getElementById("subtimer_pass_audio");
        audio.play()

        this.stop()
    }

}


document.addEventListener('keydown', (event) => {
    if (event.key == " ") {
    }
});

// I'm not sure if adding the same function twice in two scripts will cause issues so I'm renaming this one to st_ (i need to add it here in case subtimer is used without timer)
function st_checkTime(i) {
    // formats times
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

function updateClock(t) {
    let rt = subtimer.length - t + 1
    let rmins = st_checkTime(Math.floor(rt / 60))
    let rsecs = st_checkTime(rt % 60)
    $("#subtimer_time").text(`${rmins}:${rsecs}`)
}