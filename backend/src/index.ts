import WebSocket, { WebSocketServer } from "ws";

interface websocketI {
    roomId: string;
    name: string;
}

const wss = new WebSocketServer({ port: 8080 });

const socket = new Map<WebSocket, websocketI>();

wss.on("connection", (ws) => {
    ws.on("message", (message: any) => {
        const response = JSON.parse(message.toString());

        if (response.type === "join") {
            socket.set(ws, {
                roomId: response.payload.roomId,
                name: response.payload.name
            });
            console.log("User joined:", socket.get(ws));
        }

       
        if (response.type === "chat") {
            const roomId = response.payload.roomId;
            const chatMsg = response.payload.message;

          
            for (const [client, info] of socket) {
                if (info.roomId === roomId && client.readyState === WebSocket.OPEN) {
                    client.send(
                        JSON.stringify({
                            type: "chat",
                            from: socket.get(ws)?.name,
                            roomId,
                            message: chatMsg
                        })
                    );
                }
            }
        }
    });
});
