function updateNumber(number_name) {
    var new_number = $(`#i_${number_name}`).val()
    var new_name = $(`#in_${number_name}`).val().replace(" ", "_")
    var new_color = $(`#c_${number_name}`).val()
    var wiggle = document.getElementById("w_"+number_name).checked;
    var separator = $(`#s_${number_name}`).val()
    if ($(`#i_${new_name}`).length && new_name != number_name) {
        alert("New name must be unique.")
        $(`#in_${number_name}`).hide()
        $(`#n_${number_name}`).show()
    } else {
        $.post("./numbers/update", { "name": number_name, "number": new_number, "new_name": new_name, "new_color": new_color, "wiggle": wiggle, "separator": separator })
        $(`#in_${number_name}`).hide()
        $(`#n_${number_name}`).text(new_name.replace("_", " "))
        $(`#n_${number_name}`).show()
    }

}

function editName(number_name) {
    $(`#n_${number_name}`).hide()
    $(`#in_${number_name}`).show()
}

function newNumber() {
    var next_num = $(".number_editor").length + 1
    console.log(next_num)
    var number_html = `<div class="number_editor"> <div class="number_name" id="n_Statistic_${next_num}" onclick="editName('Statistic_${next_num}')">Statistic ${next_num}</div> <input class="number_name_editor" id="in_Statistic_${next_num}" type="text" value="Statistic_${next_num}" style="text-align: center; display: none;" inputmode="text" onfocusout="updateNumber('Statistic_${next_num}')"> <input class="number_value_editor" id="i_Statistic_${next_num}" type="text" value="0" style="text-align: center;" inputmode="numeric" onchange="updateNumber('Statistic_${next_num}')"> <span> <input class="number_color_editor" id="c_Statistic_${next_num}" type="color" value="#FFFFFF" onchange="updateNumber('Statistic_${next_num}')"></span><span class="stat_setting"><label for="w_Statistic_${next_num}">Wiggle</label><input id="w_Statistic_${next_num}" type="checkbox" onchange="updateNumber('Statistic_${next_num}')"></span><span class="stat_setting"> <input class="number_separator_editor" id="s_Statistic_${next_num}" type="number" onchange="updateNumber('Statistic_${next_num}')" value="1"></span> </div>`
    console.log(number_html)
    $(".numbers_container").append(number_html)
    $.post("./numbers/add", { "name": `Statistic_${next_num}` })
}

function rmNumber() {
    $(".numbers_container").children().last().remove()
    $.post("./numbers/rm")
}