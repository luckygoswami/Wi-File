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

  // Find the device name associated with the socket ID
  const deviceName = connectedDevices[req.body.socketId]?.name || undefined;
  const filePath = `/uploads/${req.file.filename}`;

  // Emit the file upload event with the file info and device name
  io.emit("fileUploaded", {
    fileName: req.file.originalname,
    filePath: filePath,
    deviceName: deviceName,
  });

  res.status(200).send("File uploaded successfully.");
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Clear the uploads directory
function clearUploadsDirectory() {
  const directory = "uploads";

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Unable to read uploads directory:", err);
      return;
    }

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) {
          console.error("Unable to delete file:", err);
        }
      });
    }

    console.log("Uploads directory cleared.");
  });
}

// Handle new socket connections
io.on("connection", (socket) => {
  console.log("New device connected:", socket.id);

  io.emit("getDeviceType");

  // Store the connected device
  socket.on("sendDeviceType", (currentDeviceType) => {
    connectedDevices[socket.id] = {
      id: socket.id,
      type: currentDeviceType,
    };

    // Broadcast the updated list of devices
    io.emit("updateDeviceList", connectedDevices);
  });

  // When the client sends a device name, store it
  socket.on("setDeviceName", (deviceName, deviceType) => {
    connectedDevices[socket.id] = {
      id: socket.id,
      name: deviceName,
      type: deviceType,
    };
    io.emit("updateDeviceList", connectedDevices);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("Device disconnected:", socket.id);
    delete connectedDevices[socket.id];
    io.emit("updateDeviceList", connectedDevices);

    // Clear uploads directory if no devices are connected
    if (Object.keys(connectedDevices).length === 0) {
      clearUploadsDirectory();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
