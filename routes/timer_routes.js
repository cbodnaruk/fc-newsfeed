const express = require('express')
const router = express.Router()
const timer = require('./timer.js')
const last_tick = 0;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });



router.get('/editor', async (req, res) => {
    try {
        const phase_list = await db.any('SELECT * FROM timers ORDER BY id');
        res.render('timer_editor', { "phases": phase_list });
    }
    catch (e) {
        res.send(e)
        console.log(e)
    }
    

});

router.get('/view',  (req, res) => {
res.render('timer');
    

});

router.ws('/sync', (ws, req) => {
    ws.on('message', function (msg) {
        if (msg == "start") {
            console.log("starting");
            timer.initialise(20);
            console.log(timer.total_time);
            timer.tick()
            const ticker = setInterval(timer.tick, timer.update_rate);
        } else if (msg == "pause") {
            console.log("pausing");
            timer.is_paused = true;
        } else if (msg == "unpause") {
            console.log("unpausing");
            timer.is_paused = false;
        }
    });
});




module.exports = router;