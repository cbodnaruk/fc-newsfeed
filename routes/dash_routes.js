
const express = require('express')
const router = express.Router({mergeParams: true})
const {prefs, dash_list} = require('./Preferences.js');

const newsfeed_routes = require('../module_routes/newsfeed_routes.js');
router.use('/newsfeed', newsfeed_routes);
const timer_routes = require('../module_routes/timer_routes.js');
router.use('/timer', timer_routes);


router.get('/', async (req, res) => {
    let dashId = req.params.dash_id
    if (dash_list.includes(dashId)){
      res.render('home', { 'site_title': prefs[dashId].site_title, 'header_title': prefs[dashId].header_title, 'header_subtitle': prefs[dashId].header_subtitle, 'dash_id': dashId });
    } else {
      res.render('landing', {"is404": true})
    }
  })
  
  router.get('/admin', async (req, res) => {
    let dashId = req.params.dash_id
    if (dash_list.includes(dashId)){
      res.render('administration', { 'site_title': prefs[dashId].site_title, 'header_title': prefs[dashId].header_title, 'header_subtitle': prefs[dashId].header_subtitle, 'dash_id': dashId });
    } else {
      res.render('landing', {"is404": true})
    }
  })

module.exports = router;