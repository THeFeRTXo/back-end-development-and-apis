import http from 'http';
import fs from 'fs';
import { WebSocketServer , WebSocket} from 'ws';

const PORT = 3001;

const server = http.createServer((req, res) => {
    if (req.url === '/script.js') {
        fs.readFile("./public/script.js", (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Not found");
                return;
            }
            // Tipo correcto para JavaScript
            res.writeHead(200, { "Content-Type": "application/javascript" }); 
            res.end(data);
        });
    } 
    // Para cualquier otra ruta (como la principal '/'), enviamos index.html
    else {
        fs.readFile("./public/index.html", (err, data) => {
            if (err){
                res.writeHead(500);
                res.end("Error loading page");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }
})

const wss = new WebSocketServer({server});

wss.on("connection", (socket, req) => {
    const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",
    );

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ "type": "system", "text": username + " joined" }));
        }
    });

    socket.on("message", (data) => {
        const dataParsed = JSON.parse(data);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ "type": "chat", "username" : dataParsed.username , "text" : dataParsed.text }));
            }
        });
    })

    socket.on("close", () => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'system', text: username + ' left' }));
            }
        });
    })
})

server.listen(PORT, () => {
    console.log("Chat server running at http://localhost:3001");
})
