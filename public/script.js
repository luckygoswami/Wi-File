const socket = io();

let currentSocketId = null;

// Prompt the user for a device name
document.getElementById("device-name-submit").addEventListener("click", () => {
  const deviceName = document.getElementById("device-name-input").value.trim();
  if (deviceName) {
    // Send the device name to the server
    socket.emit("setDeviceName", deviceName);
    document.getElementById("device-name-prompt").style.display = "none";
  } else {
    alert("Please enter a device name.");
  }
});

// Store the current socket ID for future use
socket.on("connect", () => {
  currentSocketId = socket.id;
});

// Update the list of connected devices
socket.on("updateDeviceList", (devices) => {
  const deviceList = document.getElementById("device-list");
  deviceList.innerHTML = "";

  for (let id in devices) {
    const li = document.createElement("li");
    li.textContent = `${devices[id].name} (${id})`; // Display the device name
    deviceList.appendChild(li);
  }
});

// Handle file uploads
document.getElementById("upload-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData();
  const fileInput = document.getElementById("file-input");
  formData.append("file", fileInput.files[0]);
  formData.append("socketId", currentSocketId); // Add the socket ID to the form data

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);
      fileInput.value = ""; // Clear the file input
    })
    .catch((err) => {
      console.error("Error uploading file:", err);
    });
});

// Update the list of available files when a new file is uploaded
socket.on("fileUploaded", ({ fileName, filePath, deviceName }) => {
  const fileList = document.getElementById("file-list");
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.href = filePath;
  link.download = fileName;
  link.textContent = `${fileName} (Shared by ${deviceName})`; // Display the file name and device name
  li.appendChild(link);
  fileList.appendChild(li);
});
