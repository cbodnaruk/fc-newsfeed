 	
    setInterval(reloadPosts,60000);
    $( document ).ready(function() {
        reloadPosts();
    });

  function reloadPosts(){
    $("#newsfeed").load("/newsfeed/postsload",function(response, status, xhr){
        if (xhr.status == 200){
            document.getElementById("newsfeed").firstElementChild.style.border = "4px solid #ffffff"
        } else if (xhr.status == 304){
            document.getElementById("newsfeed").firstElementChild.style.border = "4px solid #c0c0c0"
        }
    });
  }