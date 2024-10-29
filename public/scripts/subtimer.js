console.log("loaded")

const subtimer = {
    time: 0,

    last_tick:0,
    interval:0,
    length:0,
    tick: function(){
        this.tick.bind(this)
        let s = Math.round(Date.now() / 1000);
        if (s > this.last_tick) {
                this.time += 1;
                updateClock(this.time)
                if (this.time == this.length){
                    this.timeout()
                }
            };

    
        this.last_tick = s;

    },
    start: function(t){
        let tick = this.tick.bind(this)
        this.length = t
        this.interval = setInterval(tick,250)
        $("#subtimer_start_button").hide('fast')
        $("#subtimer_view").show()
    },
    stop: function(){
        clearInterval(this.interval)
    },
    timeout: function(){

    }

}


document.addEventListener('keydown', (event) => {
    if (event.key == " "){
        alert("space")
    }
});

// I'm not sure if adding the same function twice in two scripts will cause issues so I'm renaming this one to st_ (i need to add it here in case subtimer is used without timer)
function st_checkTime(i) {
    // formats times
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

function updateClock(t){
let rt = subtimer.length - t +1
    let rmins = st_checkTime(Math.floor(rt/60))
    let rsecs = st_checkTime(rt % 60)
$("#subtimer_time").text(`${rmins}:${rsecs}`)
}