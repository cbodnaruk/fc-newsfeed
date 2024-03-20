wsocket = new WebSocket('ws://localhost:8080/timer/sync');
console.log(wsocket.readyState);
wsocket.addEventListener("open", (event) => {
    wsocket.send("open");
});
wsocket.addEventListener("message", (event) => {
    $("#time").text(event.data)
});

