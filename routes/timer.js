const server_timer = {
    start_time: 0,
    total_time: 0,
    time_elapsed: 0,
    update_rate: 100,
    is_paused: false,
    tick: function () {
        let s = Math.round(Date.now() / 1000);

        if (s > last_tick) {
            if (!server_timer.is_paused) {

                server_timer.time_elapsed += 1;
                aWss.clients.forEach(function (client) {

                    client.send(server_timer.time_elapsed);
                });
            };
            last_tick = s;
        }
    },
    initialise: function (length) {
        this.total_time = length;
        let s = Math.round(Date.now() / 1000);
        this.start_time = last_tick = s;

    },
    pause: function () {
        if (!this.is_paused) {
            this.is_paused = true;
        }
    },
    unpause: function () {
        if (this.is_paused) {
            this.is_paused = false;
        }
    },
    stop: function () {
        clearInterval(ticker);
    }
}

module.exports = server_timer;