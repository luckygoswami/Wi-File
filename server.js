const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const os = require("os");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

let connectedDevices = {};

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

// Fetch ipv4 address
function getIPv4Address() {
  const interfaces = os.networkInterfaces();
  let ipv4Address = "";

  for (const interfaceName in interfaces) {
    const iface = interfaces[interfaceName];

    for (const alias of iface) {
      if (alias.family === "IPv4" && !alias.internal) {
        ipv4Address = alias.address;
        break;
      }
    }

    if (ipv4Address) {
      break;
    }
  }

  return ipv4Address;
}

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

  io.emit("sendIP", getIPv4Address(), PORT);

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

server.listen(PORT, () => {
  console.log(
    `Server started at port: ${PORT} \npress Ctrl + C to stop the application\n`
  );
});

// Using dynamic import of 'open' module
(async () => {
  const open = (await import("open")).default;

  // URL to be opened
  const url = `http://${getIPv4Address()}:${PORT}`;

  // Open the URL in the default web browser
  open(url)
    .then(() =>
      console.log(
        `Wi-File opened in the browser with url: ${url}\nMake sure to open the same url in other devices.\n`
      )
    )
    .catch((err) => console.error("Error opening the URL:", err));
})();
