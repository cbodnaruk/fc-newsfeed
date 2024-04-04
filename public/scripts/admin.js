$(document).ready(function () {
    loadTimerAdmin()
});


function loadTimerAdmin() {
    $("#timer_controller").load("/timer/controller", function (response, status, xhr) {

    });
    $("#timer_editor").load("/timer/editor", function (response, status, xhr) {

    });
    $("#timer").load("/timer/view")
}