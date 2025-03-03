// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Crear aplicación Express
const app = express();

// Configuración de CORS para Express
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Crear servidor HTTP
const server = http.createServer(app);

// Variable para almacenar el contador
let counter = 0;

// Inicializar Socket.IO con CORS configurado
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir todas las conexiones - puedes restringirlo después
    methods: ["GET", "POST"],
    credentials: true,
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
const PORT = process.env.PORT || 3006;

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor Socket.IO escuchando en puerto ${PORT}`);
});
