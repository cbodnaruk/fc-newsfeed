
const express = require('express')
var fs = require('fs');
const router = express.Router({ mergeParams: true })
var dash_list = fs.readFileSync('dash_list.txt', 'utf8');
var prefs = fs.readFileSync('prefs.json', 'utf8')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const jst = require("javascript-stringify");
const newsfeed_routes = require('../module_routes/newsfeed_routes.js');
router.use('/newsfeed', newsfeed_routes);
const timer_routes = require('../module_routes/timer_routes.js');
router.use('/timer', timer_routes);


router.get('/', async (req, res) => {
  let dashId = req.params.dash_id
  prefs = JSON.parse(fs.readFileSync('prefs.json', 'utf8'))
  dash_list = fs.readFileSync('dash_list.txt', 'utf8');
  if (dash_list.includes(dashId)) {
    res.render('home', { 'dash_id': dashId, 'preferences': prefs[dashId] });
  } else {
    res.render('landing', { "is404": true })
  }
})

router.get('/admin', async (req, res) => {
  let dashId = req.params.dash_id
  if (dash_list.includes(dashId)) {
    prefs = JSON.parse(fs.readFileSync('prefs.json', 'utf8'))
    dash_list = fs.readFileSync('dash_list.txt', 'utf8');
    res.render('administration', { 'dash_id': dashId, 'preferences': prefs[dashId], 'prefsobj': jst.stringify(prefs[dashId]) });
  } else {
    res.render('landing', { "is404": true })
  }
})
router.post('/updatepreferences', urlencodedParser, (req, res) => {
  if (dash_list.includes(dashId)) {
    res.render('home', { 'dash_id': dashId, 'preferences': prefs[dashId] });
  } else {
    res.render('landing', { "is404": true })
  }
})

router.get('/admin', async (req, res) => {
  let dashId = req.params.dash_id
  if (dash_list.includes(dashId)) {
    prefs = JSON.parse(fs.readFileSync('prefs.json', 'utf8'))
    dash_list = fs.readFileSync('dash_list.txt', 'utf8');
    res.render('administration', { 'dash_id': dashId, 'preferences': prefs[dashId], 'prefsobj': jst.stringify(prefs[dashId]) });
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
    if (err) throw err;
    console.log('The file has been saved!');
  })
})
module.exports = router;