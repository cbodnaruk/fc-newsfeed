class Timer {
    constructor() {
    this.start_time= 0;
    this.total_time= 0;
    this.time_elapsed= 0;
    this.update_rate= 100;
    this.is_running= false;
    this.is_paused= false;
    this.tick= function (last_tick) {
        let s = Math.round(Date.now() / 1000);

        if (s > last_tick) {
            if (!Timer.is_paused) {

                Timer.time_elapsed += 1;
                aWss.clients.forEach(function (client) {

                    client.send(Timer.time_elapsed);
                });
            };
            last_tick = s;
        }
    };
    this.initialise= function (length,last_tick) {
        this.is_paused = false;
        this.total_time = length;
        let s = Math.round(Date.now() / 1000);
        this.start_time = last_tick = s;
        Timer.is_running = true;

    };
    this.pause= function () {
        if (!this.is_paused) {
            this.is_paused = true;
        }
    };
    this.unpause= function () {
        if (this.is_paused) {
            this.is_paused = false;
        }
    };
    this.stop = function () {
        this.is_paused=true;
        this.total_time=0;
        this.start_time=0;
        this.time_elapsed=0;
        Timer.is_running = false;
        aWss.clients.forEach(function (client) {

            client.send(this.time_elapsed);
        });

    };
    this.reset= function(scope,phase_list) {
        if (scope == "f"){
        this.time_elapsed = 0;
        } else if (scope == "p"){
            const phase_points = [0];
            for (let i = 1; i<10; i++ ){
                phase_list.forEach((element) => {
                    let new_point = phase_points.at(-1) + parseInt(element.duration);
                    phase_points.push(new_point);
                });
            }
            for (let i = 0; i<phase_points.length; i++){
                if (this.time_elapsed < phase_points[i]){
                    this.time_elapsed = phase_points[i-1];
                    break;
                }
            }
        };
    }
};}

module.exports = Timer;