var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
const express = require('express')
const app = express()
const pgp = require('pg-promise')();
global.db = pgp('postgres://pi:db448@localhost:5432/dash_data');
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



var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080, () => {
    console.log('Port 8080 Open')
});
httpsServer.listen(8443, () => {
    console.log('Port 8443 Open')
});

global.aWss = expressWs.getWss();



