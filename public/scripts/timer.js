// for testing only:
//wsocket = new WebSocket('ws://' + location.host + '/demo/timer/sync');
wsocket = new WebSocket('wss://' + location.host + '/'+dash_id+'/timer/sync');
var this_phase_id = 0;

console.log(wsocket.readyState);
wsocket.addEventListener("open", (event) => {
    wsocket.send("open");
});
wsocket.addEventListener("message", (event) => {
    if (event.data == "s") {
        location.reload()
    } else {
        updateClock(parseInt(event.data));
    };
});
var current_phase_id = 0;
var game_length = 0
var phase_lengths = []
var phase_points = []
var numturns = 0
var current_turn_id = 0
var end_phase = false
var turn_phases = []
var gid_list = []
$(document).ready(function () {
    var numphases = document.getElementById("phaselist").childElementCount - 1;
    for (let i = 0; i < numphases; i++) {
        phase_lengths[i] = phaseData[i].duration * 60;
        game_length += phase_lengths[i]
        if (i > 0) {
            phase_points[i + 1] = phase_lengths[i] + phase_points[i]
        } else {
            phase_points[i + 1] = phase_lengths[i];
            phase_points[i] = 0
        }
        gid_list.push(phaseData[i].gid)
    }
    for (let i = 0; i < gid_list.length; i++){
        if (i==0){
            turn_phases.push(1)
        } else if (gid_list[i] != gid_list[i-1]){
            turn_phases.push(1)
        } else {
            var new_val = turn_phases.pop() + 1
            turn_phases.push(new_val)
        }
    }
    numturns = gameStructure.length;
    phase_points.pop();
    document.getElementById("phaselist").children[this_phase_id+1].classList.add("this_phase")
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
        
        var current_time = tc % game_length;
        let i = 0
        let this_phase = false
        while (!this_phase) {
            if (current_time > phase_points[i]) {
                i++

            } else {
                this_phase = true;
            }
        }
        i--
        var current_turn = phaseData[i].gid ;
        checkTurn(current_turn);
        let remaining_s = phase_lengths[i] - (current_time - phase_points[i]);
        let rmins = checkTime(Math.floor(remaining_s / 60));
        let rsecs = checkTime(remaining_s % 60);
        var turncalc = 0
        var current_turn_count = 0
        while (turncalc < phase_points.length){
            if (turncalc < i-1){
                turncalc += turn_phases[current_turn_count]
                current_turn_count ++
            } else {
                break
            }
            
        }
        $("#time").text(rmins + ":" + rsecs);
        $("#current_turn").text((current_turn_count+1)+ " ("+phaseData[i].round_name+")");
        var phase_name = document.getElementById("phaselist").children[i+1].children[0].children[0].innerHTML
        $("#current_phase").text(phase_name);
        if (i != this_phase_id) {
            document.getElementById("phaselist").children[i+1].classList.add("this_phase")
            document.getElementById("phaselist").children[this_phase_id+1].classList.remove("this_phase")
            this_phase_id = i;
        }

        playAudio(remaining_s, i)

    }
}

function checkTurn(current_turn){
for (let i = 1; i < document.getElementById("phaselist").childElementCount; i++){
    var row = document.getElementById("phaselist").children[i]
    if (row.className == "gid"+current_turn || row.className == "gid"+current_turn+" this_phase"){
        row.style.display = ""
    } else {
        row.style.display = "none"
    }
}
}

function playAudio(secs, turn){
    if (current_turn_id == 0){
        //run if start of game
        current_turn_id = phaseData[turn].gid
    } else if (current_turn_id != phaseData[turn].gid){
        //run if new turn
        var audio = document.getElementById("round_end_audio");
        audio.play()
        end_phase = false
        current_turn_id = phaseData[turn].gid
    } else if (end_phase == true){
        //run if new phase
        var audio = document.getElementById("phase_end_audio");
        audio.play()
        end_phase = false
    }
    
    if (secs == 0){
        end_phase = true
    }

}