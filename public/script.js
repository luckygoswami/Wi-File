const socket = io();
const deviceNameInput = document.getElementById("device-name-input");
const urlInfo = document.querySelector("a.url");

// Animation for set button
const setButton = document.querySelector(".set-button");
const buttonText = document.querySelector(".tick");

let tickMark = `<svg width="15" height="11.638" viewBox="0 0 15 11.638" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" fill-rule="nonzero" d="M4.942 11.545 0.07 6.675l1.464 -1.464 3.409 3.409L13.466 0.098 14.927 1.559"/></svg>`;

buttonText.innerHTML = "Set";

function setButtonAnimation() {
  if (buttonText.innerHTML !== "Set") {
    buttonText.innerHTML = "Set";
  } else if (buttonText.innerHTML === "Set") {
    buttonText.innerHTML = tickMark;
  }
  setButton.classList.toggle("button__circle");
}

let currentSocketId = null;

// Set URL with IP address
socket.on("sendIP", (IPaddress, PORT) => {
  urlInfo.href = `http://${IPaddress}:${PORT}`;
  urlInfo.textContent = `${IPaddress}:${PORT}`;
});

// Detect device type from window oject
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

// Function to fetch and send the device name
function fetchDeviceName() {
  let deviceName = deviceNameInput.value.trim();

  if (deviceName) {
    // Send the device name to the server
    socket.emit("setDeviceName", deviceName, detectDevice());
    deviceNameInput.value = "";
    setButtonAnimation();
  } else {
    alert("Please enter a device name.");
  }
}

// Set the device name
deviceNameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchDeviceName();
  }
});

setButton.addEventListener("click", fetchDeviceName);

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
    li.innerHTML = `${deviceIcon} <strong>${deviceName}</strong> (device id: ${id})`;

    deviceList.appendChild(li);
  }
});

document.getElementById("file-input").addEventListener("change", function () {
  const fileNameDisplay = document.getElementById("file-name-display");
  const selectedFile = this.files[0];

  if (selectedFile) {
    fileNameDisplay.textContent = `Selected file: ${selectedFile.name}`;
  } else {
    fileNameDisplay.textContent = "No file chosen";
  }
});

// Handle file uploads
document.getElementById("upload-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData();
  const fileInput = document.getElementById("file-input");
  formData.append("file", fileInput.files[0]);
  formData.append("socketId", currentSocketId);

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);
      // Clear the file input and reset the file name display
      fileInput.value = "";
      document.getElementById("file-name-display").textContent = "No file chosen";
    })
    .catch((err) => {
      console.error("Error uploading file:", err);
    });
});

// Function to update the list of available files
function updateFileList(files) {
  const fileList = document.getElementById("file-list");
  const noFilesMessage = document.getElementById("no-files-message");

  // Clear the current file list
  fileList.innerHTML = "";

  if (files.length === 0) {
    noFilesMessage.style.display = "block"; // Show the message if no files
  } else {
    noFilesMessage.style.display = "none"; // Hide the message if there are files
    files.forEach((file) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = file.filePath;
      link.download = file.fileName;
      link.innerHTML = `${file.fileName} ${
        file.deviceName
          ? ` <span style="font-weight: lighter;">-shared by ${file.deviceName}</span>`
          : ""
      }`;
      li.appendChild(link);
      fileList.appendChild(li);
    });
  }
}

// Handle the fileUploaded event
socket.on("fileUploaded", (file) => {
  const existingFiles = [...document.querySelectorAll("#file-list li")].map((li) => {
    const link = li.querySelector("a");
    return {
      fileName: link.textContent.split(" ")[0],
      filePath: link.href,
      deviceName: link.textContent.split("shared by ")[1] || "",
    };
  });

  existingFiles.push(file); // Add the new file to the list
  updateFileList(existingFiles); // Update the file list
});

// Initial call to handle cases when the page loads with no files
updateFileList([]);
