
const express = require('express')
const router = express.Router({mergeParams: true})
const {prefs, dash_list} = require('./Preferences.js');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const jst = require("javascript-stringify");
const newsfeed_routes = require('../module_routes/newsfeed_routes.js');
router.use('/newsfeed', newsfeed_routes);
const timer_routes = require('../module_routes/timer_routes.js');
router.use('/timer', timer_routes);


router.get('/', async (req, res) => {
    let dashId = req.params.dash_id
    if (dash_list.includes(dashId)){
      res.render('home', { 'dash_id': dashId, 'preferences': prefs[dashId] });
    } else {
      res.render('landing', {"is404": true})
    }
  })
  
  router.get('/admin', async (req, res) => {
    let dashId = req.params.dash_id
    if (dash_list.includes(dashId)){
      res.render('administration', {'dash_id': dashId, 'preferences': prefs[dashId], 'prefsobj': jst.stringify(prefs[dashId]) });
    } else {
      res.render('landing', {"is404": true})
    }
  })
router.post('/updatepreferences',urlencodedParser, (req,res) => {
  let dashId = req.params.dash_id
  prefs[dashId][req.body.preference] = req.body.value;
  console.log(req.body.preference, req.body.value, prefs[dashId])
})
module.exports = router;