const express = require('express')
const router = express.Router()
const timer = require('./timer.js')
const last_tick = 0;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const full_db_call = 'SELECT game_structure.id, timers.id, round_name, phase, duration FROM game_structure INNER JOIN round_types ON game_structure.round_id = round_types.id INNER JOIN timers ON round_types.id = timers.round_id ORDER BY game_structure.id ASC, timers.id asc;'
const phases_db_call = 'SELECT * from timers ORDER BY id;'
const rounds_db_call = 'SELECT * from round_types ORDER BY id;'
const game_db_call = 'SELECT * FROM game_structure ORDER BY id;'

router.get('/editor', async (req, res) => {
    try {
        const round_list = await db.any(rounds_db_call); 
        const phase_list = await db.any(phases_db_call);
        const game_list = await db.any(game_db_call);
        res.render('timer_editor_new', { "phases": phase_list, "rounds": round_list, "structure": game_list, "is_running": timer.is_running, "is_paused": timer.is_paused });
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
        const phase_list = await db.any(full_db_call);
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
    add_phase(req.body.id,req.body.round_id);

});

router.post('/remove', urlencodedParser, async (req, res) => {
    remove_phase()

});

router.post('/newround', urlencodedParser, async (req, res) => {
    await db.none(`INSERT INTO round_types (id, round_name) VALUES ('${req.body.id}','New Round');`);
    await db.none(`INSERT INTO timers (phase, duration, round_id) VALUES ('','0','${req.body.id}');`)
    console.log("saved new round type")
});

router.post('/rmround', urlencodedParser, async (req, res) => {
    await db.none(`DELETE FROM round_types WHERE id = '${req.body.id}';`);
})
;
router.post('/reloadoptions', urlencodedParser, async (req, res) => {
    var rounds = await db.any(`SELECT `); //working here
})
;)
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

async function add_phase(id,round_id) {
    try {
        await db.none(`INSERT INTO timers (id,phase,duration,round_id) VALUES (${id},'',0,${round_id})`
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
        return await db.any(phases_db_call);

    }
    catch (e) {
        console.log(e)
    }
}

module.exports = router;