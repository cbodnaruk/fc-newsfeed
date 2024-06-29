$(document).ready(function () {
    loadTimerAdmin()
});


function loadTimerAdmin() {
    $("#timer_controller").load("/demo/timer/controller", function (response, status, xhr) {

    });
    $("#timer_editor").load("/demo/timer/editor", function (response, status, xhr) {

    });
    $("#timer").load("/demo/timer/view")
}

