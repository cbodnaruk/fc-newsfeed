const express = require('express')
const app = express()
const port = 80
const pgp = require('pg-promise')();
global.db = pgp('postgres://postgres:admin@localhost:5432/postgres');
const pug = require('pug');
const expressWs = require('express-ws')(app);

const newsfeed_routes = require('./routes/newsfeed_routes.js');
app.use('/newsfeed', newsfeed_routes);
const timer_routes = require('./routes/timer_routes.js');
app.use('/timer', timer_routes);

const prefs = require('./Preferences.js');
app.use(express.static('public'));
let sqlSanitizer = require('sql-sanitizer');
app.use(sqlSanitizer);
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', './views');


app.get('/', async (req, res) => {

    res.render('home', { 'site_title': prefs.site_title, 'header_title': prefs.header_title, 'header_subtitle': prefs.header_subtitle });

})

app.get('/admin', async (req, res) => {
    res.render('administration', { 'site_title': prefs.site_title, 'header_title': prefs.header_title, 'header_subtitle': prefs.header_subtitle });

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



global.aWss = expressWs.getWss();



