const express = require('express')
var fs = require('fs');
const router = express.Router({ mergeParams: true })
var prefs = fs.readFileSync('prefs.json', 'utf8');
const default_prefs = JSON.parse(fs.readFileSync('default_prefs.json', 'utf-8'));
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const bcrypt = require('bcrypt');
const saltRounds = 10;
var cookieSession = require('cookie-session')

router.use(cookieSession({
    name: 'session',
    secret: 'cookie-secret',
    sameSite: 'strict'
  }))

async function set_pw(org,pw){
    bcrypt.hash(pw, saltRounds, function(err, hash) {
        db.none(`UPDATE organisations SET hash = '${hash}' WHERE name = '${org}';`)
    });
}

set_pw('demo','1234')
set_pw('Melbourne Megagames','123')

async function checkPassword(pw,org){
    if (pw){
    var org_data = await db.any(`SELECT hash FROM organisations WHERE name = '${org}';`)
    return await bcrypt.compare(pw,org_data[0].hash)
    } else {
        return false
    }
}
router.get('/', async (req, res) =>{
    if (req.session.org){
        var org_data = await db.any(`SELECT id, name FROM organisations WHERE name = '${req.session.org}';`)
        var dashes = await db.any(`SELECT dash_id FROM dashboards INNER JOIN organisations ON dashboards.org_id = organisations.id WHERE name = '${req.session.org}';`)
        res.render('org_admin', { 'org_data': org_data[0], 'dashes': dashes })
    } else {
        res.redirect('/org/login')
    }
    

})

router.get('/login', async (req, res) => {
    // req.session.views = (req.session.views || 0) + 1
    var orgs = await db.any('SELECT name FROM organisations;')

    // // Write response
    // res.send(req.session.views + ' views')
    res.render('org_login', { "org_list": orgs, "pw_attempt": req.query.pw_attempt })
  })
  
router.post('/login', urlencodedParser, async (req, res) => {
    var status = await checkPassword(req.body.pw, req.body.org)
    if (status){
        req.session.org = req.body.org
        res.send('/org')
    } else{
        var orgs = await db.any('SELECT name FROM organisations;')
        res.send('/org/login?pw_attempt=false')
    }
  })

  router.post('/logout', urlencodedParser, async (req, res) => {
    req.session.org = ''
    res.send('/')
  });
module.exports = router;