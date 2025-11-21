import WebSocket, { WebSocketServer } from "ws";
let allSocket = new Map();
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
    ws.send("Conneted to WebSocket Server 8080");
    ws.on("message", (message) => {
        const data = JSON.parse(message);
        if (data.type == "join") {
            allSocket.set(ws, { name: data.payload.name, roomId: data.payload.roomId });
            console.log("User Connetected", { name: data.payload.name, roomId: data.payload.roomId });
        }
        if (data.type == "chat") {
            for (const [key, values] of allSocket.entries()) {
                if (data.payload.roomId == values.roomId) {
                    key.send(JSON.stringify(data.payload.message));
                    console.log(allSocket);
                }
            }
        }
    });
});
//# sourceMappingURL=index.js.map