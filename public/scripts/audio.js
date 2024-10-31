function AudioCue() {
    this.URL = "",
    this.name = ""
}

//Load audio cues in the admin panel
function loadAudio() {
    var audio_cues = $("#audio_cues")
    var cue_html = ""
    for (i in audioCues){
        cue_html = `<div class="audio_cue" id="cue_${audioCues[i].id}"><input type="text" id="cue_name_${audioCues[i].id}" class="audio_input" value="${audioCues[i].name}" onchange="updateAudio(event)"><input type="text" id="cue_url_${audioCues[i].id}" class="audio_input" value="${audioCues[i].url}" onchange="updateAudio(event)"></div>`
        audio_cues.append(cue_html)
    }
};
function updateAudio(event){
    var trigger = event.target.id
    var trig_id = trigger.split("_")[2]
    var trig_type = trigger.split("_")[1]
    var trig_content = $(event.target).val()
    console.log(trigger+" "+trig_content)
    //post then save to db
    $.post("./audio/update", { "id": trig_id, "type": trig_type, "content": trig_content })
}

function addCue(){
    var last_cue_id = $("#audio_cues").children().last().attr('id')
    console.log(last_cue_id)
    var new_cue_id = parseInt(last_cue_id.split("_")[1]) + 1
    console.log(new_cue_id)

    var cue_html = `<div class="audio_cue" id="cue_${new_cue_id}"><input type="text" id="cue_name_${new_cue_id}" class="audio_input" value="New Cue" onchange="updateAudio(event)"><input type="text" id="cue_url_${new_cue_id}" class="audio_input" value="Cue URL" onchange="updateAudio(event)"></div>`
    $("#audio_cues").append(cue_html)
    
    //send to db
    $.post('./audio/add')
}


function deleteCue(){
    var last_cue = $("#audio_cues").children().last()
    var last_cue_id = parseInt(last_cue.attr('id').split("_")[1])
    last_cue.remove()
    //send to db
    $.post('./audio/remove', { "id": last_cue_id })
}