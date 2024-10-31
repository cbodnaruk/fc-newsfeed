const express = require('express')
const router = express.Router({mergeParams: true})
const Timer = require('./timer.js')
var bodyParser = require('body-parser');
const qsstringify = require('qs');
var fs = require('fs');
const jst = require("javascript-stringify");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const safeJSONParse = (JSONObj, defaultValue) => {
    try {
        const parsedValue = JSON.parse(JSONObj);
        return parsedValue;
    } catch (e) {
        console.log("ERROR: Could not parse JSON value " + JSONObj);
        return defaultValue;
    }
  }

router.get('/admin', async (req, res) => {
    let dash_id = req.params.dash_id
    res.render('subtimer_admin', { "preferences": JSON.parse(fs.readFileSync('prefs.json', 'utf8'))[dash_id], safeJSONParse });
});

router.get('/view', async (req, res) => {
    let dash_id = req.params.dash_id
    console.log(JSON.parse(fs.readFileSync('prefs.json', 'utf8'))[dash_id] )
res.render('subtimer', { "preferences": JSON.parse(fs.readFileSync('prefs.json', 'utf8'))[dash_id], "prefsobj": jst.stringify(JSON.parse(fs.readFileSync('prefs.json', 'utf8'))[dash_id])  });
});

module.exports = router;