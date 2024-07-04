$(document).ready(function () {
    loadTimerAdmin()
});


function loadTimerAdmin() {
    $("#timer_controller").load("/"+dash_id+"/timer/controller", function (response, status, xhr) {

    });
    $("#timer_editor").load("/"+dash_id+"/timer/editor", function (response, status, xhr) {

    });
    $("#timer").load("/"+dash_id+"/timer/view")
}

