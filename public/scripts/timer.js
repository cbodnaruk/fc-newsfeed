wsocket = new WebSocket('wss://' + location.host + '/demo/timer/sync');
var this_phase_id = 0;
console.log(wsocket.readyState);
wsocket.addEventListener("open", (event) => {
    wsocket.send("open");
});
wsocket.addEventListener("message", (event) => {
    console.log(event.data)
    if (event.data == "s") {
        location.reload()
    } else {
        updateClock(parseInt(event.data));
    };
});
var current_phase_id = 0;
var turn_length = 0
var phase_lengths = []
var phase_points = []
var numturns = 0
$(document).ready(function () {
    var numphases = document.getElementById("phaselist").childElementCount - 1;
    for (let i = 0; i < numphases; i++) {
        phase_lengths[i] = phaseData[i].duration * 60;
        turn_length += phase_lengths[i]
        if (i > 0) {
            phase_points[i + 1] = phase_lengths[i] + phase_points[i]
        } else {
            phase_points[i + 1] = phase_lengths[i];
            phase_points[i] = 0
        }
    }
    numturns = gameStructure.length;
    phase_points.pop();
});



function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

function updateClock(tc) {
    if (Number.isNaN(tc)) {
        $("#time").text("00:00");
        $("#current_turn").text("New Turn");
        $("#current_phase").text("New Turn");
    } else {
        var current_turn = Math.floor(tc / turn_length);
        var current_time = tc % turn_length;
        let i = 0
        let this_phase = false
        while (!this_phase) {
            if (current_time > phase_points[i]) {
                i++

            } else {
                this_phase = true;
            }
        }
        checkTurn(current_turn+1);
        let remaining_s = phase_lengths[i - 1] - (current_time - phase_points[i - 1]);
        let rmins = checkTime(Math.floor(remaining_s / 60));
        let rsecs = checkTime(remaining_s % 60);

        $("#time").text(rmins + ":" + rsecs);
        $("#current_turn").text(current_turn + 1);
        var phase_name = document.getElementById("phaselist").children[i].children[0].children[0].innerHTML
        $("#current_phase").text(phase_name);
        if (i != this_phase_id) {
            document.getElementById("phaselist").children[i+1].classList.toggle("this_phase")
            document.getElementById("phaselist").children[this_phase_id+1].classList.toggle("this_phase")
            this_phase_id = i;
        }

    }
}

function checkTurn(current_turn){
    console.log(current_turn)
for (let i = 1; i < document.getElementById("phaselist").childElementCount; i++){
    var row = document.getElementById("phaselist").children[i]
    console.log(row.className+": "+"gid"+current_turn)
    if (row.className == "gid"+current_turn || row.className == "gid"+current_turn+" this_phase"){
        row.style.display = ""
    } else {
        row.style.display = "none"
    }
}
}