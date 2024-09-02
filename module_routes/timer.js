class Timer {
    constructor() {
    this.start_time= 0;
    this.total_time= 0;
    this.time_elapsed = 0;
    this.update_rate= 100;
    this.is_running= false;
    this.is_paused= false;
    this.last_tick = 1;
    this.dash_id = "";
    };
    tick () {
        this.tick.bind(this)
        let s = Math.round(Date.now() / 1000);
        
        if (s > this.last_tick) {
            if (!this.is_paused) {

                this.time_elapsed += 1;
                aWss.clients.forEach(function (client) {

                    if (client.id == this.dash_id+"-view"){
                    client.send(this.time_elapsed);}
                }, this);
            };

        }
        this.last_tick = s;
    };
    initialise () {
        this.is_paused = false;
        let s = Math.round(Date.now() / 1000);
        this.start_time = s;
        this.is_running = true;
        return `Timer started: ${this.dash_id}`

    };
    pause () {
        if (!this.is_paused) {
            this.is_paused = true;
        }
    };
    unpause () {
        if (this.is_paused) {
            this.is_paused = false;
        }
    };
    stop() {
        this.is_paused=true;
        this.start_time=0;
        this.time_elapsed=0;
        this.is_running = false;
        aWss.clients.forEach(function (client) {

            if (client.id == this.dash_id+"-view"){
            client.send(this.time_elapsed);}
        }, this);
    };
    reset(scope,phase_list) {
        if (scope == "f"){
        this.time_elapsed = 0;
        } else if (scope == "p"){
            const phase_points = [0];
            for (let i = 1; i<10; i++ ){
                phase_list.forEach((element) => {
                    let new_point = phase_points.at(-1) + (parseInt(element.duration)*60);
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
    };
    skip (phase_list){
        // find current phase
        const phase_points = [0];
        for (let i = 1; i<10; i++ ){
            phase_list.forEach((element) => {
                let new_point = phase_points.at(-1) + (parseInt(element.duration)*60);
                phase_points.push(new_point);
            });
        }
        console.log(phase_list)
        // cycle through phases until this one, set to end of this phase
        for (let i = 0; i<phase_points.length; i++){
            if (this.time_elapsed < phase_points[i]){
                console.log("adding "+(phase_points[i]-this.time_elapsed)+"s")
                this.time_elapsed = phase_points[i];
                break;
            }
        }
    }
};

module.exports = Timer;