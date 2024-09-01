// for testing only:
//wsocket = new WebSocket('ws://' + location.host + '/demo/timer/sync');
wsocket = new WebSocket('wss://' + location.host + '/'+dash_id+'/timer/sync');
var current_sel_round = 1;
var next_phase_id = 0;
let keepAliveTimer = 0;
function keepAlive(timeout = 30000) {
    if (wsocket.readyState == wsocket.OPEN){
        wsocket.send('');
    }
    keepAliveTimer = setTimeout(keepAlive, timeout);
}

$(document).ready(function () {
    try {current_sel_round = roundData[0].id
        next_phase_id = phaseData[phaseData.length - 1].id + 1
    } catch(e){};

    $("#round_editor").load("./timer/editor/rounds?sel="+current_sel_round)
    $("#timer_editor_gamestructure").load("./timer/editor/game")
});
wsocket.addEventListener("open", (event) => {
    wsocket.send("open");
    keepAlive()
});
function addRow(){
    $.post("./timer/add", { "id": next_phase_id , "round_id": current_sel_round })
    setTimeout(() => {
        $("#round_editor").load("./timer/editor/rounds?sel="+current_sel_round);
    }, 300);
    next_phase_id += 1;
}
function deleteRow(){
    $("#phaselist").children().last().remove();
    $.post("./timer/remove")

}

function addRoundRow(){
$.post("./timer/editstructure", {"method": "ad"})
setTimeout(() => {
    $("#timer_editor_gamestructure").load("./timer/editor/game");
}, 300);
}

function deleteRoundRow() {
    $.post("./timer/editstructure",{"method": "rm"})
    setTimeout(() => {
        $("#timer_editor_gamestructure").load("./timer/editor/game");
    }, 300);
}

function updatePhase(event){
var trig_str = event.target.id.replace(/[^0-9.]/g, "").split('.');
var trig_id = trig_str[0]
var trig_type = event.target.id.charAt(0);
var trig_val = $(event.target).val();
$.post("./timer/update", { "id": trig_id , "type": trig_type , "content": trig_val })
setTimeout(() => {
    $("#round_editor").load("./timer/editor/rounds?sel="+current_sel_round);
}, 300);

}

function updatePhaseBool(event){
    var trig_str = event.target.id.replace(/[^0-9.]/g, "").split('.');
    var trig_id = trig_str[0]
    var trig_type = event.target.id.charAt(0);
    var trig_val = document.getElementById(event.target.id).checked;
    $.post("./timer/update", { "id": trig_id , "type": trig_type , "content": trig_val })
    setTimeout(() => {
        $("#round_editor").load("./timer/editor/rounds?sel="+current_sel_round);
    }, 300);
    
    }

function updateName(){
    var trig_val = $("#round_name").val()
    $.post("./timer/update", {"id": current_sel_round, "type": "n" , "content": trig_val})
    $("#select"+current_sel_round).text(trig_val)
    setTimeout(() => {
        $("#round_editor").load("./timer/editor/rounds?sel="+current_sel_round);
        $("#timer_editor_gamestructure").load("./timer/editor/game");
    }, 300);
};

function updateGameRound(event){
    var trig_str = event.target.id.replace(/[^0-9.]/g, "").split('.');
var trig_id = trig_str[0]
var trig_val = $(event.target).find('option:selected').text();
$.post("./timer/update", { "id": trig_id , "type": "g" , "content": trig_val })
}

function reloadOptions(){
    $("#timer_editor_gamestructure").load("./timer/editor/game")
    
}

function changeRound(event){
var trig_id = event.target.id.slice(6);
current_sel_round = parseInt(trig_id);
$("#round_editor").load("./timer/editor/rounds?sel="+current_sel_round)

}

function pChangeRound(trig_id){
    current_sel_round = parseInt(trig_id);
    setTimeout(() => {
        $("#round_editor").load("./timer/editor/rounds?sel="+current_sel_round);
    }, 300);
}

function newRound(){
    //add new button
     var new_id = parseInt($("#round_selectors").children().last().children("span").attr('id').slice(6)) + 1
    $("#round_selectors").append(`<div class="paddedbtn" id="sdiv${new_id}"><span class="btnb" id="select${new_id}" onClick="changeRound(event)">New Round</span></div>`)
    
//create new round type
$.post("./timer/newround", {"id":new_id })
pChangeRound(new_id)
    //add blank line
    var con_new_box = ''
    con_new_box += `<tr id="pir${new_id}">`
    con_new_box+= `<td><input class="phase_input" id="phase1.${new_id}" type='text' value='' onchange='updatePhase(event)'></td>`
    con_new_box+= `<td><input class="phase_input" id="duration1.${new_id}" type='text' value='0' onchange='updatePhase(event)'></td>`
    con_new_box+= '</tr>'

    $("#phaselist").append(con_new_box)
    reloadOptions();
}

function rmRound(){
//remove button
$("#sdiv"+current_sel_round).remove();

//remove from db
$.post("./timer/rmround", {"id":current_sel_round});

//find next round
var topround = 0
for (round in roundData){
if (roundData[round].id > topround){
    topround = roundData[round].id
    
} 
}
pChangeRound(topround);
reloadOptions();
}

function startTimer(newState) {

    if (newState){
        wsocket.send("start");
        $(".phase_input").attr('disabled',true)
        $("#roundlist").attr('disabled',true)
        $("#start_timer").text('Stop');
        $("#start_timer").attr('onClick','startTimer(false)');
        } else {
            wsocket.send("stop");
            $(".phase_input").attr('disabled',false)
            $("#roundlist").attr('disabled',false)
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

