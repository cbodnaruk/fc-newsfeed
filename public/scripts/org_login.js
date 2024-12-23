function login(){
    // post password
    var org_name =  $("#org_select").val()
    var pw = $("#org_pw").val()
    $.post("./login",{ "org": org_name, "pw": pw }, function( data ){
        window.location.replace(data)
    })
}