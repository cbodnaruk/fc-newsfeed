setTimeout(reloadPosts, 60000);


function reloadPosts() {
    $("#numbers").load(dash_id+"/numbers/view")
}
