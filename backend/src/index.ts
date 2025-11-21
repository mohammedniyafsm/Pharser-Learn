import WebSocket, { WebSocketServer } from "ws"

interface webSocketI {
    name : string,
    roomId : string
}

let allSocket = new Map<WebSocket,webSocketI>();


const wss = new WebSocketServer({ port:8080 })

wss.on("connection",(ws)=>{
  
    ws.send("Conneted to WebSocket Server 8080");

    ws.on("message",(message : any)=>{
        const data = JSON.parse(message);

        if(data.type == "join"){
            allSocket.set(ws,{name :data.payload.name,roomId:data.payload.roomId});
            console.log("User Connetected",{name :data.payload.name,roomId:data.payload.roomId});
        }

        if(data.type == "chat"){
            for( const [key,values] of allSocket.entries()){
                if(data.payload.roomId == values.roomId){
                    key.send(JSON.stringify(data.payload.message));
                    console.log(allSocket);
                }
            }
        }
    })
})


