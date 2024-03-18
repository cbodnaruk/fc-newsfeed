const express = require('express')
const app = express()
const port = 8080
const pug = require('pug');
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:admin@localhost:5432/postgres');

app.set('view engine', 'pug')
app.set('views', './views')


app.get('/', async (req, res) => {
    try {
        const post_list = await db.any('SELECT * FROM posts');
        res.render('home', { posts: post_list });    
        // success
    } 
    catch(e) {
        // error
    }
    // = read_posts()
  
})

app.get('/admin',(req, res) => {

})
app.get('/add',(req, res) => {
    save_post('test123');

})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function save_post(post_text){
    db.none(`INSERT INTO posts (posttext,timecode) VALUES ('${post_text}', LOCALTIME)`
    );
}

function read_posts(){
    return db.any('SELECT * FROM posts');
}