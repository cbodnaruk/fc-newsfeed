window.addEventListener("DOMContentLoaded", (event) => {
    var input = document.getElementById("dashboard_id");
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            openDash();
        }
    })
    });
    if (localStorage.getItem("defaultDash")) {
        window.location = localStorage.getItem("defaultDash")
    }






function openDash() {
    dashId = $("#dashboard_id").val()
    localStorage.setItem("defaultDash", dashId)
    window.location = dashId
}