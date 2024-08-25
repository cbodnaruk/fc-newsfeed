const express = require('express')
const router = express.Router({mergeParams: true})

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


router.post('/postcreate', urlencodedParser, async (req, res) => {
    var new_post = ''
    try {
        new_post = req.body.text;
        var success = save_post(new_post,req.body.time,req.params.dash_id);
        while (!success) { }

        res.sendStatus(201);

    }
    catch (e) {
        res.send(toString(e));
    }
})

router.get('/editorload', async (req, res) => {
    try {
        let dash_id = req.params.dash_id
        const post_list = await db.any(`SELECT * FROM posts WHERE dash_id = '${dash_id}' ORDER BY id`);
        res.render('newsfeed_admin', { "posts": post_list });
    }
    catch (e) {
        res.send(error)
    }
})

router.get('/postsload', async (req, res) => {
    try {
        let dash_id = req.params.dash_id
        const post_list = await db.any(`SELECT * FROM posts WHERE dash_id = '${dash_id}' ORDER BY id`);
        res.render('newsfeed', { "posts": post_list, "dash_id": dash_id });
    }
    catch (e) {
        res.send(error)
    }
})

router.post('/postdelete', urlencodedParser, async (req, res) => {
    var post_id;
    try {
        post_id = req.body.id;
        var success = delete_post(post_id);
        while (!success) { }

        res.sendStatus(201);

    }
    catch (e) {
        res.send(toString(e));
    }
})

router.post('/postupdate', urlencodedParser, async (req, res) => {

    try {
        var success = update_post(req.body.id, req.body.text);
        while (!success) { }

        res.sendStatus(201);

    }
    catch (e) {
        res.send(toString(e));
    }
})

async function save_post(post_text,post_time,dash_id) {
    console.log(`INSERT INTO posts (posttext,timecode,active,dash_id) VALUES ('${post_text}', LOCALTIME(0),true,${dash_id})`)
    try {
        

        await db.none(`INSERT INTO posts (posttext,timecode,active,dash_id) VALUES ('${post_text}', '${post_time}',true,'${dash_id}')`);

        return true
    }
    catch (e) {
        return false
    }
}

async function delete_post(id) {
    try {
        await db.none(`UPDATE posts SET active = false WHERE ID = ${id}`
        );
        return true
    }
    catch (e) {
        return false
    }
}

async function update_post(id, text) {
    try {
        await db.none(`UPDATE posts SET posttext = '${text}' WHERE ID = ${id}`
        );
        return true
    }
    catch (e) {
        return false
    }
}

module.exports = router;