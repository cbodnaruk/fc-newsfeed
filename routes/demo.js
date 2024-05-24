
const express = require('express')
const router = express.Router()
const prefs = require('../demo_routes/Preferences.js');
const newsfeed_routes = require('../demo_routes/newsfeed_routes.js');
router.use('/newsfeed', newsfeed_routes);
const timer_routes = require('../demo_routes/timer_routes.js');
router.use('/timer', timer_routes);


router.get('/', async (req, res) => {

    res.render('home', { 'site_title': prefs.site_title, 'header_title': prefs.header_title, 'header_subtitle': prefs.header_subtitle });

})

router.get('/admin', async (req, res) => {
    res.render('administration', { 'site_title': prefs.site_title, 'header_title': prefs.header_title, 'header_subtitle': prefs.header_subtitle });

})

module.exports = router;