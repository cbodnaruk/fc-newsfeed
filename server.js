var fs = require('fs');
var http = require('http');
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
const expressWs = require('express-ws')(app);

app.use((req, res, next) => {
    if (req.path.slice(-1) === '/' && req.path.length > 1) {
      const query = req.url.slice(req.path.length)
      const safepath = req.path.slice(0, -1).replace(/\/+/g, '/')
      res.redirect(301, safepath + query)
    } else {
      next()
    }
  })


app.use(express.static('public'));
let sqlSanitizer = require('sql-sanitizer');
app.use(sqlSanitizer);
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', './views');

const dash_routes = require('./routes/dash_routes.js');

app.get('/login', (req, res) => {
  res.send("test")
})

app.use('/:dash_id', dash_routes);



app.get('/', async (req, res) => {

    res.render('landing', {"is404": false});
})



app.use((req, res, next) => {
    res.status(404).render('landing', {"is404": true})
  });


  

app.listen(8080, () => {
    console.log('Port 8080 Open')
});

global.aWss = expressWs.getWss();



