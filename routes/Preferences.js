var prefs = {
    demo: {
        dash_id: "demo",
        site_title: "Demo - Yugenya Informat",
        header_title: "ІНФОРМАТ СЕРВИС ЮҐЕНЯ",
        header_subtitle: "Yugenya Information Service",
        slot_a: "timer",
        slot_b: "newsfeed"
    }, dniwa: {
        dash_id: "dniwa",
        site_title: "Infinite Horizons",
        header_title: "Infinite Horizons",
        header_subtitle: "Round Timer",
        slot_a: "timer",
        slot_b: "newsfeed"
    }
};

const dash_list = ["demo", "dniwa"]
module.exports = { prefs, dash_list };