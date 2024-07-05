const dashboard_settings = {
    show(dash_id) {
        var modal = document.getElementById("prefsmodal");
        modal.style.display = "block";
    
    },
    hide(){
        var modal = document.getElementById("prefsmodal");
        if (this.needs_refresh){
            location.reload()
        }
        modal.style.display = "none";
    },
    update(event){
    
        var trig_str = event.target.id.substring(2);
    var trig_val = $(event.target).val();
        $.post("./updatepreferences", {"preference": trig_str,"value": trig_val})
    
    this.needs_refresh = true;
    
    },
    needs_refresh: false
    }

$(document).ready(function () {
    $("#timer").load("/"+dash_id+"/timer/editor", function (response, status, xhr) {

    });
    $("#newsfeed").load("./newsfeed/editorload", function (response, status, xhr) {

    });
    dashboard_settings.needs_refresh = false
    if ($("#viewcontrol").css("display") == "block"){
        $(".slot_b").css("display","none")
    }
});



window.onclick = function(event) {
    var modal = document.getElementById("prefsmodal");
    if (event.target == modal) {
      dashboard_settings.hide()
    }
  }

  function switchTab(new_tab){
    $(".tabbtn").removeClass("clicked")
    $("#tab_"+new_tab).addClass("clicked")
    $(".slot").css("display","none")
    $(".slot_"+new_tab).css("display","block")
}