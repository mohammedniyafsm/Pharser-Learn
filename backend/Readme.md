# Basic websocket Server 

`import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port:8080 });

let allSocket : WebSocket[] =[]

wss.on("connection",(ws)=>{

    allSocket.push(ws);
    
    console.log("User Conneted");

    ws.send("Websocket Running at port 8080");

    ws.on("message",(message)=>{

        for(let i=0;i<allSocket.length;i++){
            allSocket[i]?.send(message.toString());
        }
    })

})
`

# web socket with Rooms 
