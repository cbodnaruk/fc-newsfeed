

setInterval(reloadPosts, 60000);
$(document).ready(function () {
    reloadPosts();
});

function reloadPosts() {
    $("#loading").show()
    $("#newsfeed").load("../" + dash_id + "/newsfeed/postsload/", function (response, status, xhr) {
        if (xhr.status == 200) {
            document.getElementById("postlist").children[0].classList.add("recentpost")
        } else if (xhr.status == 304) {
            document.getElementById("postlist").children[0].classList.remove("recentpost")
        }
        $("#loading").hide()
    });
}
