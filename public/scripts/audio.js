function AudioCue() {
    this.URL = "",
    this.name = ""
}

function loadAudio() {
    var audio_cues = $("#audio_cues")
    var cue_html = ""
    for (i in audioCues){
        cue_html = `<div class="audio_cue" id="cue_${audioCues[i].id}"><input type="text" id="cue_name_${audioCues[i].id}" class="audio_input" value="${audioCues[i].name}" onchange="updateAudio(event)"><input type="text" id="cue_url_${audioCues[i].id}" class="audio_input" value="${audioCues[i].url}" onchange="updateAudio(event)"></div>`
        audio_cues.append(cue_html)
    }
};
function updateAudio(event){
    
}