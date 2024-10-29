
const express = require('express')
var fs = require('fs');
const router = express.Router({ mergeParams: true })
var dash_list = fs.readFileSync('dash_list.txt', 'utf8');
var prefs = fs.readFileSync('prefs.json', 'utf8');
const default_prefs = JSON.parse(fs.readFileSync('default_prefs.json', 'utf-8'));
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const jst = require("javascript-stringify");
const newsfeed_routes = require('../module_routes/newsfeed_routes.js');
router.use('/newsfeed', newsfeed_routes);
const timer_routes = require('../module_routes/timer_routes.js');
router.use('/timer', timer_routes);
const numbers_routes = require('../module_routes/numbers_routes.js');
router.use('/numbers', numbers_routes);
const subtimer_routes = require('../module_routes/subtimer_routes.js');
router.use('/subtimer', subtimer_routes);

const safeJSONParse = (JSONObj, defaultValue) => {
  try {
      const parsedValue = JSON.parse(JSONObj);
      return parsedValue;
  } catch (e) {
      console.log("ERROR: Could not parse JSON value " + JSONObj);
      return defaultValue;
  }
}

function checkPrefCompleteness(raw_prefs) {
let new_prefs = {}
  for (p in default_prefs){
    console.log(`${p}: ${raw_prefs[p]} (${default_prefs[p]})`)
    if (raw_prefs.hasOwnProperty(p)){
      new_prefs[p] = raw_prefs[p]
    } else {
      new_prefs[p] = default_prefs[p]
    }
  }
  console.log(new_prefs)
return new_prefs
}

router.get('/', async (req, res) => {
  let dashId = req.params.dash_id
  prefs = JSON.parse(fs.readFileSync('prefs.json', 'utf8'))
  var dash_list = JSON.parse(fs.readFileSync('dash_list.txt', 'utf8'));
  if (dash_list.includes(dashId)) {
    res.render('home', { 'dash_id': dashId, 'preferences': prefs[dashId], safeJSONParse });
  } else {
    res.render('landing', { "is404": true })
  }
})

router.get('/admin', async (req, res) => {
  let dashId = req.params.dash_id
  if (dash_list.includes(dashId)) {
    prefs = checkPrefCompleteness(JSON.parse(fs.readFileSync('prefs.json', 'utf8'))[dashId])

    dash_list = fs.readFileSync('dash_list.txt', 'utf8');
    res.render('administration', { 'dash_id': dashId, 'preferences': prefs, 'prefsobj': jst.stringify(prefs), safeJSONParse });
  } else {
    res.render('landing', { "is404": true })
  }
})


router.get('/media', async (req, res) => {
  let dashId = req.params.dash_id
  if (dash_list.includes(dashId)) {
    prefs = JSON.parse(fs.readFileSync('prefs.json', 'utf8'))
    dash_list = fs.readFileSync('dash_list.txt', 'utf8');
    res.render('media', { 'dash_id': dashId, 'preferences': prefs[dashId], 'prefsobj': jst.stringify(prefs[dashId]) });
  } else {
    res.render('landing', { "is404": true })
  }
})
router.post('/updatepreferences', urlencodedParser, (req, res) => {
  let dashId = req.params.dash_id
  prefs[dashId][req.body.preference] = req.body.value;
  fs.writeFile('prefs.json', JSON.stringify(prefs), (err) => {
    if (err) console.log("Failed to save");
    console.log('The file has been saved!');
  })
})
module.exports = router;