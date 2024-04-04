wsocket = new WebSocket('ws://'+location.host+'/timer/sync');



function addRow(){
    var numphases = document.getElementById("phaselist").childElementCount - 1;
    $("#phaselist").append(`<tr><td><input class="phase_input" id="phase${numphases+1}" type="text" onchange="updatePhase(event)"/></td><td><input class="phase_input" onchange="updatePhase(event)" id="duration${numphases+1}" type="text"/></td>`)
    $.post("/timer/add", { "id": numphases+1 })

}
function deleteRow(){
    $("#phaselist").children().last().remove();
    $.post("/timer/remove")

}

function updatePhase(event){

var trig_id = event.target.id.slice(-1);
var trig_type = event.target.id.charAt(0);
var trig_val = $(event.target).val();
$.post("/timer/update", { "id": trig_id , "type": trig_type , "content": trig_val })

}

function startTimer(newState) {

    if (newState){
        wsocket.send("start");
        $(".phase_input").attr('disabled',true)
        $("#start_timer").text('Stop');
        $("#start_timer").attr('onClick','startTimer(false)');
        } else {
            wsocket.send("stop");
            $(".phase_input").attr('disabled',false)
            $("#start_timer").text('Start');
            $("#start_timer").attr('onClick','startTimer(true)');
        }
}

function resetTimer(scope) {
    wsocket.send("reset"+scope)
}

function pauseTimer(newState) {
    if (newState){
    wsocket.send("pause");
    $("#pause_timer").text('Unpause');
    $("#pause_timer").attr('onClick','pauseTimer(false)');
    } else {
        wsocket.send("unpause");
        $("#pause_timer").text('Pause');
        $("#pause_timer").attr('onClick','pauseTimer(true)');
    }
}

