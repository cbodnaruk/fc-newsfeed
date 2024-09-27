const express = require('express')
const router = express.Router({mergeParams: true})
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });


router.post('/update', urlencodedParser, async (req, res) => {
if (req.body.type == "name"){
    await db.none(`UPDATE audio_cues SET name = '${req.body.content}' where id = ${req.body.id};`);
} else if (req.body.type == "url"){
    await db.none(`UPDATE audio_cues SET url = '${req.body.content}' where id = ${req.body.id};`);
}
});

router.post('/add', urlencodedParser, async (req, res) => {
    await db.none(`INSERT INTO audio_cues (url,name,dash_id) VALUES ('Cue URL', 'New Cue','${req.params.dash_id}');`)
});

router.post('/remove', urlencodedParser, async (req, res) => {
    await db.none(`DELETE FROM audio_cues WHERE id = ${req.body.id};`)
});

module.exports = router;