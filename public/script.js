const socket = io();

// Update the list of connected devices
socket.on("updateDeviceList", (devices) => {
  const deviceList = document.getElementById("device-list");
  deviceList.innerHTML = "";

  for (let id in devices) {
    const li = document.createElement("li");
    li.textContent = `Device ID: ${id}`;
    deviceList.appendChild(li);
  }
});

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
socket.on("fileUploaded", ({ fileName, filePath }) => {
  const fileList = document.getElementById("file-list");
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.href = filePath;
  link.download = fileName;
  link.textContent = fileName;
  li.appendChild(link);
  fileList.appendChild(li);
});
