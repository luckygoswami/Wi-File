const socket = io();
const deviceNameInput = document.getElementById("device-name-input");

let currentSocketId = null;

// Detect device type
function detectDevice() {
  const ua = navigator.userAgent;
  const width = window.innerWidth;

  let deviceType;

  if (/mobile/i.test(ua) || width < 768) {
    deviceType = "Mobile";
  } else if (/tablet/i.test(ua) || (width >= 768 && width < 1024)) {
    deviceType = "Tablet";
  } else {
    deviceType = "Desktop";
  }

  return deviceType;
}

const currentDeviceType = detectDevice();

deviceNameInput.placeholder = `e.g. Lucky's ${currentDeviceType}`;

socket.on("getDeviceType", () => {
  socket.emit("sendDeviceType", currentDeviceType);
});

function fetchDeviceName() {
  const deviceName = deviceNameInput.value.trim();
  if (deviceName) {
    // Send the device name to the server
    socket.emit("setDeviceName", deviceName, detectDevice());
    deviceNameInput.value = "";
  } else {
    alert("Please enter a device name.");
  }
}

// set the device name
deviceNameInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    fetchDeviceName();
  }
});

document
  .getElementById("device-name-submit")
  .addEventListener("click", fetchDeviceName);

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
    const deviceType = devices[id].type;
    let deviceIcon;

    switch (deviceType) {
      case "Desktop":
        deviceIcon = `<i class="fa-solid fa-desktop"></i>`;
        break;
      case "Mobile":
        deviceIcon = `<i class="fa-solid fa-mobile-screen-button"></i>`;
        break;
      case "Tablet":
        deviceIcon = `<i class="fa-solid fa-tablet-screen-button"></i>`;
        break;
      default:
        deviceIcon = ""; // Handle any unexpected device types
    }

    const deviceName = devices[id].name || ""; // Fallback to an empty string if name is undefined
    li.innerHTML = `${deviceIcon} ${deviceName} (device id: ${id})`;

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
  link.textContent = `${fileName} ${deviceName ? `shared by ${deviceName}` : ""}`; // Display the file name and device name
  li.appendChild(link);
  fileList.appendChild(li);
});
