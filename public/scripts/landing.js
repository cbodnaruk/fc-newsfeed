var input = document.getElementById("dashboard_id");
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("gobtn").click();
    }
}); 