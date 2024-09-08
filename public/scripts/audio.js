function AudioCue() {
    this.URL = "",
    this.name = ""
}

$(document).ready(function () {
    var audio_cues = $("#audio_cues")
    var cue_html = ""
    for (i in audioCues){
        cue_html = `<div class="audio_cue" id="cue_${audioCues[i].id}"><`
        audio_cues.append()
    }
});