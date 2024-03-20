const express = require('express')
const app = express()
const port = 8080
const pug = require('pug');
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:admin@localhost:5432/postgres');
const title = 'Yugenya Informat'

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'))
let sqlSanitizer = require('sql-sanitizer');
app.use(sqlSanitizer);
app.use(express.json()); 

app.set('view engine', 'pug')
app.set('views', './views')


app.get('/', async (req, res) => {
    try {
        const post_list = await db.any('SELECT * FROM posts ORDER BY id');
        res.render('home', { "posts": post_list , 'site_title': title});    
        // success
    } 
    catch(e) {
        // error
    }
    // = read_posts()
  
})

app.get('/admin', async (req, res) => {
    try {
        const post_list = await db.any('SELECT * FROM posts ORDER BY id');
        res.render('administration', { "posts": post_list , 'site_title': title});
    } 
catch(e) {
    res.send(error)
}
})
app.post('/admin', urlencodedParser, async (req,res) => {
var new_post = ''
try {
    new_post = req.body.text;
    var success = save_post(new_post);
    while (!success) {}
 
            res.sendStatus(201);

}
catch(e) {
    res.send(toString(e));
}

})
app.post('/postdelete', urlencodedParser, async (req,res) => {
    var post_id;
    try {
        post_id = req.body.id;
        var success = delete_post(post_id);
        while (!success) {}
     
                res.sendStatus(201);
    
    }
    catch(e) {
        res.send(toString(e));
    }
})

app.post('/postupdate', urlencodedParser, async (req,res) => {

    try {
        var success = update_post(req.body.id,req.body.text);
        while (!success) {}
     
                res.sendStatus(201);
    
    }
    catch(e) {
        res.send(toString(e));
    }
})
app.get('/postload',async (req, res) => {
    try {
        const post_list = await db.any('SELECT * FROM posts ORDER BY id');
        res.render('posts', { "posts": post_list });
    } 
catch(e) {
    res.send(error)
}
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function  save_post(post_text){
    try {
    await db.none(`INSERT INTO posts (posttext,timecode,active) VALUES ('${post_text}', LOCALTIME(0),true)`
    );
    return true}
    catch(e){
        return false
    }
}

async function delete_post(id){
    try {
        await db.none(`UPDATE posts SET active = false WHERE ID = ${id}`
        );
        return true}
        catch(e){
            return false
        }
}

async function update_post(id,text){
    try {
        await db.none(`UPDATE posts SET posttext = '${text}' WHERE ID = ${id}`
        );
        return true}
        catch(e){
            return false
        }
}

function read_posts(){
    return db.any('SELECT * FROM posts');
}