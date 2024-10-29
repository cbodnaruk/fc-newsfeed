const express = require('express')
const router = express.Router({mergeParams: true})
const Timer = require('./timer.js')
var bodyParser = require('body-parser');
const qsstringify = require('qs');
var fs = require('fs');
const jst = require("javascript-stringify");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/admin', async (req, res) => {
res.send("Subtimer only displays from main view. Please edit it from the Admin settings panel by clicking the button in the lower right of the screen.")
});

router.get('/view', async (req, res) => {
    let dash_id = req.params.dash_id
    console.log(JSON.parse(fs.readFileSync('prefs.json', 'utf8'))[dash_id] )
res.render('subtimer', { "preferences": JSON.parse(fs.readFileSync('prefs.json', 'utf8'))[dash_id] });
});

module.exports = router;