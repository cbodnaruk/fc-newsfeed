wsocket = new WebSocket('ws://localhost:8080/timer/sync');

function addRow(){
    $("#phaselist").append('<tr><td><input id="phase2" type="text"/></td><td><input id="duration2" type="text"/></td>')
}
function deleteRow(){
    $("#phaselist").children().last().remove();
}

function startTimer() {
    wsocket.send("start");
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
function unpauseTimer() {

}