function logout(){
  $.post('./org/logout', function(data){
    window.location.replace('/')
  })
}
