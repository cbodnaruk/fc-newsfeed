function login(){
    // post password
    var pw = $("#org_pw").val()
    $.post("./setup_login",{ "password": pw }, function( data ){
        $("#setup_content").html(data)
    })
}

function selectOrg(e){
    var org = e.target.id.split('_')[1]
    $(".org_name_selected").toggleClass('org_name_selected')
    $(e.target).toggleClass('org_name_selected')
    $("#org_dash_list").html("")
    $("#reset_pw_btn").prop("disabled",false)
    for (x in org_list){
        if (org_list[x].id == org){
            $("#org_contact").text(org_list[x].contact)
        }
    }
    for (x in dash_list){
        if (dash_list[x].org_id == org){
            $("#org_dash_list").append(`<p class="org_dash">${dash_list[x].dash_id}</p>`)
        }
    }

}

function newOrg(){
    var org_name = prompt("New Org Name")
    var org_contact = prompt("New Org Contact")
    $.post("./new_org", { "name": org_name, "contact": org_contact } )
    setTimeout(() => {
        window.location.reload()
      }, 300)
}

function resetPassword(){
    
    $.post('./reset_password', {"org": $(".org_name_selected").first().text()})
}