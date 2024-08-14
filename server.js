const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

let connectedDevices = {};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filePath = `/uploads/${req.file.filename}`;
  io.emit("fileUploaded", { fileName: req.file.originalname, filePath });
  res.status(200).send("File uploaded successfully.");
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Handle new socket connections
io.on("connection", (socket) => {
  console.log("New device connected:", socket.id);

  // Store the connected device
  connectedDevices[socket.id] = { id: socket.id };

  // Broadcast the updated list of devices
  io.emit("updateDeviceList", connectedDevices);

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("Device disconnected:", socket.id);
    delete connectedDevices[socket.id];
    io.emit("updateDeviceList", connectedDevices);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
