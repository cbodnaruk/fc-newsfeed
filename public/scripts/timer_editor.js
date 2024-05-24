wsocket = new WebSocket('wss://'+location.host+'/timer/sync');

var current_sel_round = 1;

$(document).ready(function () {
    var rows = $("#phaselist").children(":not(.head)").each(function() {
        var iid = "pir"+current_sel_round
        var rid = this.id;
        if (rid != iid){
            $(this).hide();
        } else {
            $(this).show();
        }
    }
)});

function addRow(){
    var numphases = document.getElementById("phaselist").childElementCount - 1;
    $("#phaselist").append(`<tr><td><input class="phase_input" id="phase${numphases+1}" type="text" onchange="updatePhase(event)"/></td><td><input class="phase_input" onchange="updatePhase(event)" id="duration${numphases+1}" type="text"/></td>`)
    $.post("./timer/add", { "id": numphases+1 , "round_id": current_sel_round })

}
function deleteRow(){
    $("#phaselist").children().last().remove();
    $.post("./timer/remove")

}

function updatePhase(event){

var trig_str = event.target.id.replace(/[^0-9.]/g, "").split('.');
var trig_id = trig_str[0]
var trig_type = event.target.id.charAt(0);
var trig_val = $(event.target).val();
$.post("./timer/update", { "id": trig_id , "type": trig_type , "content": trig_val })

}
function reloadOptions(){
    $("#roundlist").children(":not(.head)").each(function() {
        var opts = this.lastChild.firstChild.childNodes;
        for (i = 0; i < opts.length; i++){
            console.log(opts[i])
        }
    });
    
}

function changeRound(event){
var trig_id = event.target.id.slice(6);
$("#round_name").val(event.target.innerText)
current_sel_round = parseInt(trig_id);
    $("#phaselist").children(":not(.head)").each(function() {
        var iid = "pir"+current_sel_round
        var rid = this.id;
        if (rid != iid){
            $(this).hide();
        } else {
            $(this).show();
        }
    }
)

}

function pChangeRound(trig_id){
    $("#round_name").val($("#select"+trig_id).val())
    current_sel_round = parseInt(trig_id);
        $("#phaselist").children(":not(.head)").each(function() {
            var iid = "pir"+current_sel_round
            var rid = this.id;
            if (rid != iid){
                $(this).hide();
            } else {
                $(this).show();
            }
        }
    )
}

function newRound(){
    //add new button
     var new_id = parseInt($("#round_selectors").children().last().children("span").attr('id').slice(6)) + 1
    $("#round_selectors").append(`<div class="paddedbtn" id="sdiv${new_id}"><span class="btnb" id="select${new_id}" onClick="changeRound(event)">New Round</span></div>`)
//create new round type
$.post("./timer/newround", {"id":new_id })
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

pChangeRound(1);
reloadOptions();
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

