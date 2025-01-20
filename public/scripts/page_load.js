$( document ).ready(function() {
    $("#timer").load(dash_id+"/timer/view")
    $("#numbers").load(dash_id+"/numbers/view")
    $("#subtimer").load(dash_id+"/subtimer/view")
    if ($("#viewcontrol").css("display") == "block"){
        $(".slot_b").css("display","none")
    }
    localStorage.setItem("defaultDash", dash_id)
});

function switchTab(new_tab){
    $(".tabbtn").removeClass("clicked")
    $("#tab_"+new_tab).addClass("clicked")
    $(".slot").css("display","none")
    $(".slot_"+new_tab).css("display","block")
}