function submitPost(){
    var post_text = $("#postinput").val();
    $.post("admin",{"text": post_text},reloadPage());
}
function reloadPage(){
    setTimeout(function(){
    window.location.reload(true);},30)
}

function deletePost(post_id){
if (confirm("Please confirm delete post") == true) {
    $.post("postdelete",{"id":post_id},reloadPage())}
}

function beginEdit(post_id){
const this_post = document.getElementById(post_id+"p");
const x = document.getElementsByClassName("edit");
const edit_button = x.namedItem(post_id);
const y = document.getElementsByClassName("delete");
const delete_button = y.namedItem(post_id);
delete_button.outerHTML = "";
edit_button.innerHTML = "Save Edit";
edit_button.setAttribute("onClick","endEdit(this.id)");
const current_text = this_post.children.item(0).innerHTML
this_post.children.item(0).outerHTML = "<textarea id='editinput' name='editinput' cols='45' rows='6' maxlength='255' placeholder='Write post here'>"+current_text+"</textarea>";

}

function endEdit(post_id){

    var post_text = $("#editinput").val();
//send update
if (confirm("Please confirm edit") == true) {
$.post("postupdate",{"id":post_id, "text": post_text},reloadPage())}
else{
reloadPage()

}

}