function AudioCue() {
    this.URL = "",
    this.name = ""
}

$(document).ready(function () {
    var audio_cues = $("#audio_cues")
    var cue_html = ""
    for (i in audioCues){
        cue_html = `<div class="audio_cue" id="cue_${audioCues[i].id}"><input type="text" id="cue_name_${audioCues[i].id} class="audio_input" value="${audioCues[i].name}><input type="text" id="cue_url_${audioCues[i].id} class="audio_input" value="${audioCues[i].url}></div>`
        audio_cues.append(cue_html)
    }
});