var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var dblog = fs.readFileSync('database_login.txt', 'utf8');



var credentials = {key: privateKey, cert: certificate};

const express = require('express')
const app = express()
const pgp = require('pg-promise')();
global.db = pgp(dblog);
const pug = require('pug');
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
const expressWs = require('express-ws')(app,httpsServer);

const demo = require('./routes/demo.js');
app.use('/demo', demo);

app.use(express.static('public'));
let sqlSanitizer = require('sql-sanitizer');
app.use(sqlSanitizer);
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', './views');





app.get('/', async (req, res) => {

    res.send('Home');
})


httpServer.listen(8080, () => {
    console.log('Port 8080 Open')
});
httpsServer.listen(8443, () => {
    console.log('Port 8443 Open')
});

global.aWss = expressWs.getWss();



