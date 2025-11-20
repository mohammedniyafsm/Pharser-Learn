import WebSocket, { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8000 });
let user = 0;
let allSockets = [];
wss.on("connection", (ws) => {
    allSockets.push(ws);
    user += 1;
    console.log("USer Connetected" + user);
    ws.on("message", (message) => {
        console.log(message.toString());
        console.log("this is All  socxket we saved", allSockets);
        for (let i = 0; i < allSockets.length; i++) {
            const s = allSockets[i];
            s?.send(message.toString() + "sent From Server");
        }
    });
});
//# sourceMappingURL=index.js.map