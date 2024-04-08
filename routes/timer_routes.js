const express = require('express')
const router = express.Router()
const timer = require('./timer.js')
const last_tick = 0;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });



router.get('/editor', async (req, res) => {
    try {
        const phase_list = await db.any('SELECT * FROM timers ORDER BY id');
        res.render('timer_editor', { "phases": phase_list, "is_running": timer.is_running, "is_paused": timer.is_paused });
        console.log(timer.is_running)
    }
    catch (e) {
        res.send(e)
        console.log(e)
    }


});

router.get('/controller', async (req, res) => {
    res.render('timer_controller', { "is_running": timer.is_running, "is_paused": timer.is_paused });
});

router.get('/view', async (req, res) => {
    try {
        const phase_list = await db.any('SELECT * FROM timers ORDER BY id');
        res.render('timer', { "phases": phase_list });
    }
    catch (e) {
        res.send(e)
        console.log(e)
    }

});

router.ws('/sync', (ws, req) => {
    ws.on('message', async function (msg) {
        if (msg == "start") {
            console.log("starting");
            timer.initialise(20);
            console.log(timer.total_time);
            timer.tick()
            var ticker = setInterval(timer.tick, timer.update_rate);
        } else if (msg == "stop") {
            console.log("stopping")
            timer.stop()
        } else if (msg == "pause") {
            console.log("pausing");
            timer.is_paused = true;
        } else if (msg == "unpause") {
            console.log("unpausing");
            timer.is_paused = false;
        } else if (msg == "resetf") {
            console.log("resetting full");
            timer.reset("f");
        } else if (msg == "resetp") {
            try {
                const phase_list = await db.any('SELECT * FROM timers ORDER BY id');
                console.log("resetting phase");
                timer.reset("p", phase_list)
            }
            catch (e) {
                res.send(e)
                console.log(e)
            }

        };
    });

    console.log(req.socket.remoteAddress)

});

router.post('/update', urlencodedParser, async (req, res) => {
    console.log("recieved post")
    console.log(save_phase(req.body.id, req.body.type, req.body.content))
    aWss.clients.forEach(function (client) {

        client.send("s");
    });
});

router.post('/add', urlencodedParser, async (req, res) => {
    add_phase(req.body.id)

});

router.post('/remove', urlencodedParser, async (req, res) => {
    remove_phase()

});


async function save_phase(id, type, content) {
    try {
        if (type == "p") {
            await db.none(`UPDATE timers SET phase = '${content}' WHERE id = ${id}`
            );
            console.log(`UPDATE timers SET phase = '${content}' WHERE id = ${id}`)
        } else if (type == "d") {
            await db.none(`UPDATE timers SET duration = ${content} WHERE id = ${id}`
            );
        };
        return true
    }
    catch (e) {
        return false
    }
}

async function add_phase(id) {
    try {
        await db.none(`INSERT INTO timers (id,phase,duration) VALUES (${id},'',0)`
        );
        return true
    }
    catch (e) {
        return false
    }
}

async function remove_phase() {
    try {
        await db.none(`DELETE FROM timers WHERE id in (SELECT id FROM timers ORDER BY id desc LIMIT 1)`
        );
        return true
    }
    catch (e) {
        return false
    }
}

async function get_phases() {
    try {
        return await db.any('SELECT * FROM timers ORDER BY id');

    }
    catch (e) {
        console.log(e)
    }
}

module.exports = router;