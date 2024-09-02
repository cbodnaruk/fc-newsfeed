const express = require('express')
const router = express.Router({mergeParams: true})
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var fs = require('fs');
//create a variable which holds the numbers for each dashboard
//each dashboard is represented by an object 
var dash_list = JSON.parse(fs.readFileSync('dash_list.txt', 'utf8'));
var numbers = []
function Number(name, value){
    this.name = name;
    this.value = value;
}
for (let dash in dash_list){
    numbers[dash_list[dash]] = new Array()
    numbers[dash_list[dash]].push(new Number("Stat",0))
}


router.get('/view', (req, res) => {
    res.render('numbers', { "number_list": numbers[req.params.dash_id] })

})


router.get('/editor', (req, res) => {
    res.render('numbers_editor', { "number_list": numbers[req.params.dash_id] })
})

router.post('/update', (req, res) => {
    
})

module.exports = router;