const wsServer = require("ws").Server;
const http = require("http");

const server = http.createServer().listen(8000);
const ws = new wsServer({ server: server });

/** @type {Object<number, WebSocket} */
const clients = {};
let clientId = 0;

ws.on("connection", (socket, req) => {
  const id = clientId;

  socket.on("message", (data) => {
    data = JSON.parse(data);
    console.log(data.type);

    switch (data.type) {
      case "join-request":
        clients[data.to].send(JSON.stringify({ type: data.type, offer: data.offer, from: id }));
        break;
      case "join-response":
        clients[data.to].send(JSON.stringify({ type: data.type, answer: data.answer, from: id }));
        break;
      case "ice-candidate":
        clients[data.to].send(JSON.stringify({ type: data.type, candidate: data.candidate }));
        break;
    }
  });

  clients[clientId++] = socket;
});