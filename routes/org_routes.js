const express = require('express')
var fs = require('fs');
const router = express.Router({ mergeParams: true })
var prefs = JSON.parse(fs.readFileSync('prefs.json', 'utf8'));
const default_prefs = JSON.parse(fs.readFileSync('default_prefs.json', 'utf-8'));
const cookie_secret = fs.readFileSync('cookie_secret','utf-8')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var cookieSession = require('cookie-session')

router.use(fileUpload())

router.use(cookieSession({
    name: 'session',
    secret: cookie_secret,
    sameSite: 'strict'
}))

async function set_pw(org, pw) {
    bcrypt.hash(pw, saltRounds, function (err, hash) {
        db.none(`UPDATE organisations SET hash = '${hash}' WHERE name = '${org}';`)
    });
}

async function load_dash_list() {
    list = await db.any('SELECT dash_id FROM dashboards;')
    outlist = []
    for (x in list) {
        outlist.push(list[x].dash_id)
    }
    return outlist
}


//remove after running once
set_pw('demo', 'admin')
set_pw('Melbourne Megagames', 'admin')
set_pw('Sydney Megagamers', 'admin')
set_pw('ACT Megagamers','admin')

async function checkPassword(pw, org) {
    if (pw) {
        var org_data = await db.any(`SELECT hash FROM organisations WHERE name = '${org}';`)
        return await bcrypt.compare(pw, org_data[0].hash)
    } else {
        return false
    }
}

router.get('/setup', async (req, res) => {
    res.render('org_setup_login')

})

router.post('/setup_login', urlencodedParser, async (req, res) => {
    var org_data = await db.any(`SELECT id, name, contact FROM organisations;`)
    var dashes = await db.any(`SELECT dash_id, org_id FROM dashboards INNER JOIN organisations ON dashboards.org_id = organisations.id;`)
    
    if (req.body.password == fs.readFileSync('setup_password', 'utf-8')) {
        res.render('org_setup', {'org_data': org_data,'dashes': dashes} )
    }
})

router.get('/', async (req, res) => {
    if (req.session.org) {
        var org_data = await db.any(`SELECT id, name FROM organisations WHERE name = '${req.session.org}';`)
        var dashes = await db.any(`SELECT dash_id, org_id FROM dashboards INNER JOIN organisations ON dashboards.org_id = organisations.id;`)
        var file_list_raw = fs.readdirSync(`./public/assets/${req.session.org}`)
        var file_list = []
        for (x in file_list_raw){
            if (!/___notes$/.test(file_list_raw[x])){
                file_list.push({"name":file_list_raw[x], "notes":""})
            }
        }
        for (x in file_list_raw){
            if (/___notes$/.test(file_list_raw[x])){
                for (y in file_list){
                    if (file_list[y].name == file_list_raw[x].split("_")[0]) file_list[y].notes = fs.readFileSync(`./public/assets/${req.session.org}/${file_list_raw[x]}`, 'utf-8')
            }
        }
        }
        res.render('org_admin', { 'org_data': org_data[0], 'dashes': dashes, "files": file_list })
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
    if (status) {
        req.session.org = req.body.org
        res.send('/org')
    } else {
        var orgs = await db.any('SELECT name FROM organisations;')
        res.send('/org/login?pw_attempt=false')
    }
})

router.post('/dash_update', urlencodedParser, async (req, res) => {
    var letnum = /^[a-z0-9]+$/
    prefs = JSON.parse(fs.readFileSync('prefs.json', 'utf8'));
    var org_data = await db.any(`SELECT id, name FROM organisations WHERE name = '${req.session.org}';`)
    //check again for dxxx
    if (req.body.new_id.slice(0, 1) == "d" && letnum.test(req.body.new_id)) {

        //check if dash exists, if not, make it
        var dash_list = await load_dash_list()
        if (dash_list.includes(req.body.new_id)){
        await db.none(`UPDATE dashboards SET dash_id = '${req.body.new_id}' WHERE dash_id = '${req.body.old_id}';`)
        // SET PREFERENCES
        for (x in prefs){
            if (prefs[x].dash_id == req.body.old_id){
                var new_prefs = prefs[x]
                new_prefs.dash_id = req.body.new_id
                prefs[req.body.new_id] = new_prefs
                console.log(prefs[x])
                console.log(new_prefs)
                fs.writeFile('prefs.json', JSON.stringify(prefs), (err) => {
                    if (err) console.log("Failed to save");
                    console.log('The file has been saved!');
                })
            }
        }
    } else {
        await db.none(`INSERT INTO dashboards (dash_id, org_id) VALUES ('${req.body.new_id}','${org_data[0].id}');`)
    }
    } else {
        res.status(401)
    }


})

router.post('/delete', urlencodedParser, async (req, res) => {
    await db.none(`DELETE FROM dashboards WHERE dash_id = '${req.body.dash_id}'`)
})

router.post('/reset_password', urlencodedParser, async (req, res) => {
    set_pw(req.body.org,'admin')
})

router.post('/logout', urlencodedParser, async (req, res) => {
    req.session.org = ''
    res.send('/')
});

router.post('/changepassword/check', urlencodedParser, async (req, res) => {
    var status = await checkPassword(req.body.old, req.session.org)
    console.log(`Password correct for ${req.session.org}: ${status}`)
    res.send(status)
})

router.post('/changepassword/change', urlencodedParser, async (req, res) => {
    set_pw(req.session.org,req.body.new)
    console.log(`Password updated for ${req.session.org}.`)
    res.send(true)
})

router.post('/renamefile', urlencodedParser, async (req, res) => {
    if (/^[a-z0-9_\-.]+\.[a-z0-9]+$/i.test(req.body.new)){
        fs.rename(`./public/assets/${req.session.org}/${req.body.file}`,`./public/assets/${req.session.org}/${req.body.new}`, () => {console.log(`renamed ${req.body.file} to ${req.body.new}`)})
    }
})

router.post('/uploadfile', urlencodedParser, async (req, res) => {
    let fileInput;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    fileInput = req.files.file;
    uploadPath = `${globalroot}/public/assets/${req.session.org}/${fileInput.name.replace(" ","_")}`;
    // Use the mv() method to place the file somewhere on your server
    fileInput.mv(uploadPath, function(err) {
    //   if (err)
    //     return res.status(500).send(err);
      res.send('File uploaded!');
    });
})

router.post('/deletefile', urlencodedParser, async (req, res) => {
    file_list = fs.readdirSync(`./public/assets/${req.session.org}`)
    if (file_list.includes(req.body.file)){
        fs.unlink(`./public/assets/${req.session.org}/${req.body.file}`, (err) => {
            if (err) console.log(err)
        })
    }
})

router.post('/updatenotes', urlencodedParser, async (req, res) => {
fs.writeFile(`./public/assets/${req.session.org}/${req.body.file}___notes`,req.body.notes,(err)=>{console.log(err)})
})

router.post('/new_org', urlencodedParser, async (req, res) => {
    await db.none(`INSERT INTO organisations(name,contact) VALUES ('${req.body.name}','${req.body.contact}');`)
    set_pw(req.body.name,'admin')
    if (!fs.existsSync(`./public/assets/${req.body.name}`)){
    fs.mkdirSync(`./public/assets/${req.body.name}`)}
})

module.exports = router;