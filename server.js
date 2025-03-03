// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Crear aplicación Express
const app = express();

// Crear servidor HTTP
const server = http.createServer(app);

// Variable para almacenar el contador
let counter = 0;

// Inicializar Socket.IO con CORS configurado
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:3002", "http://127.0.0.1:3002"],
    methods: ["GET", "POST"],
  },
});

// Ruta básica para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.send("Servidor Socket.IO funcionando correctamente");
});

// Manejar conexiones de Socket.IO
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Enviar el valor actual del contador al cliente que se conecta
  socket.emit("counter_update", counter);

  // Manejar evento para incrementar contador
  socket.on("increment_counter", () => {
    counter++;
    console.log("Contador incrementado:", counter);

    // Emitir el nuevo valor a todos los clientes
    io.emit("counter_update", counter);
  });

  socket.on("reset_counter", () => {
    counter = 0;
    console.log("Contador resetado:", counter);

    // Emitir el nuevo valor a todos los clientes
    io.emit("counter_update", counter);
  });

  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Definir puerto
const PORT = process.env.PORT || 80;

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor Socket.IO escuchando en puerto ${PORT}`);
});
