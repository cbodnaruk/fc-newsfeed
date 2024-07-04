const express = require('express')
const router = express.Router({mergeParams: true})

const timer = require('./timer.js')
const last_tick = 0;
var bodyParser = require('body-parser');
const qsstringify = require('qs');
const jst = require("javascript-stringify");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
function full_db_call(dash_id){ return `SELECT game_structure.id as "gid", timers.id, round_name, phase, duration FROM game_structure INNER JOIN round_types ON game_structure.round_id = round_types.id INNER JOIN timers ON round_types.id = timers.round_id WHERE dash_id = '${dash_id}' ORDER BY game_structure.id ASC, timers.id asc;`}
function phases_db_call(dash_id){return `SELECT timers.id, phase, duration, round_id, dash_id from timers inner join round_types on round_types.id = timers.round_id where dash_id = '${dash_id}' ORDER BY id;`}
function rounds_db_call(dash_id){return `SELECT * from round_types WHERE dash_id = '${dash_id}' ORDER BY id;`}
function game_db_call(dash_id){return `SELECT game_structure.id, round_id, dash_id FROM game_structure INNER JOIN round_types ON game_structure.round_id = round_types.id WHERE dash_id = '${dash_id}' ORDER BY id;`}


router.get('/editor', async (req, res) => {
    try {
        let round_list = await db.any(rounds_db_call(req.params.dash_id));
        let phase_list = await db.any(phases_db_call(req.params.dash_id));
        let game_list = await db.any(game_db_call(req.params.dash_id));
        console.log(req.params.dash_id)
        console.log(rounds_db_call(req.params.dash_id)+" -> ")
        console.log(round_list)
        res.render('timer_editor_new', { "phases": phase_list, "sphases": jst.stringify(phase_list), "rounds": round_list, "srounds": jst.stringify(round_list), "structure": game_list, "is_running": timer.is_running, "is_paused": timer.is_paused });
    }
    catch (e) {
        res.send(e)
        console.log(e)
    }

});
router.get('/editor/rounds', async (req, res) => {
    try {
        let round_list = await db.any(rounds_db_call(req.params.dash_id)); 
        let phase_list = await db.any(phases_db_call(req.params.dash_id));
        res.render('timer_editor_rounds', { "phases": phase_list, "rounds": round_list, "is_running": timer.is_running, "selection": req.query.sel });
    }
    catch (e) {
        res.send(e)
        console.log(e)
    }


});

router.get('/editor/game', async (req, res) => {
    try {
        let round_list = await db.any(rounds_db_call(req.params.dash_id)); 
        let game_list = await db.any(game_db_call(req.params.dash_id));
        res.render('timer_editor_game', { "structure": game_list, "rounds": round_list, "is_running": timer.is_running, "selection": req.query.sel });
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
        const phase_list = await db.any(full_db_call(req.params.dash_id));
        const game_struct = await db.any(game_db_call(req.params.dash_id));
        res.render('timer', { "phases": phase_list,"sphases": jst.stringify(phase_list), "sstruct": jst.stringify(game_struct) });
    }
    catch (e) {
        res.send(e)
        console.log(e)
    }
 
});

router.ws('/sync', (ws, req) => {
    ws.on('message', async function (msg) {
        console.log("connection")
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
                const phase_list = await db.any(phases_db_call(req.params.dash_id));
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
    add_phase(req.body.id,req.body.round_id,req.params.dash_id);

});

router.post('/remove', urlencodedParser, async (req, res) => {
    remove_phase(req.params.dash_id)

});

router.post('/newround', urlencodedParser, async (req, res) => {
    let dash_id = req.params.dash_id
    await db.none(`INSERT INTO round_types (id, round_name, dash_id) VALUES ('${req.body.id}','New Round','${dash_id}');`);
    await db.none(`INSERT INTO timers (phase, duration, round_id) VALUES ('','0','${req.body.id}');`)
    console.log("saved new round type")
});

router.post('/rmround', urlencodedParser, async (req, res) => {
    await db.none(`DELETE FROM round_types WHERE id = '${req.body.id}';`);
})
;
router.post('/editstructure', urlencodedParser, async (req, res) => {
    let dash_id = req.params.dash_id
    if (req.body.method == "ad"){
        await db.none(`INSERT INTO game_structure (id, round_id) VALUES (((SELECT id FROM game_structure ORDER BY id desc LIMIT 1)+1), (SELECT id FROM round_types WHERE dash_id = '${dash_id}' ORDER BY id ASC LIMIT 1));`);
    } else if (req.body.method == "rm"){
        await db.none(`DELETE FROM game_structure WHERE id in (SELECT id FROM game_structure WHERE dash_id = '${dash_id}' ORDER BY id desc LIMIT 1);`);
    }
})
;
async function save_phase(id, type, content) {
    try {
        if (type == "p") {
            await db.none(`UPDATE timers SET phase = '${content}' WHERE id = ${id}`
            );
        } else if (type == "d") {
            await db.none(`UPDATE timers SET duration = ${content} WHERE id = ${id}`
            );
        } else if (type == "n") {
            console.log(`UPDATE round_types SET round_name = '${content}' WHERE id = ${id};`)
            await db.none(`UPDATE round_types SET round_name = '${content}' WHERE id = ${id}`);
            
        } else if (type == "g"){
            await db.none(`UPDATE game_structure SET round_id = (SELECT id FROM round_types WHERE round_name = '${content}') WHERE id = ${id};`)
        };
        console.log("database updated")
        return true
    }
    catch (e) {
        console.log(e)
        return false
    }
}

async function add_phase(id,round_id,dash_id) {

    try {
        await db.none(`INSERT INTO timers (id,phase,duration,round_id,dash_id) VALUES (${id},'',0,${round_id},${dash_id})`
        );
        return true
    }
    catch (e) {
        return false
    }
}

async function remove_phase(dash_id) {
    try {
        await db.none(`DELETE FROM timers WHERE id in (SELECT id FROM timers WHERE dash_id = '${dash_id}' ORDER BY id desc LIMIT 1)`
        );
        return true
    }
    catch (e) {
        return false
    }
}

async function get_phases() {
    try {
        return await db.any(phases_db_call(req.params.dash_id));

    }
    catch (e) {
        console.log(e)
    }
}

module.exports = router;