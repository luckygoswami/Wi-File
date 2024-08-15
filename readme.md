# How to Use the Wi-Fi File Sharing App

## Introduction

This web app allows you to easily share files across multiple devices connected to the same Wi-Fi network. Whether you're at home, in an office, or any place with a common Wi-Fi connection, this tool makes file sharing simple and efficient.

## Features

- **Device Identification:** Each connected device is identified by a user-provided name.
- **File Upload:** Upload files to share with other devices on the network.
- **File List:** View and download files shared by others, with information about which device shared each file.
- **Auto Cleanup:** The upload directory is automatically cleared when all devices disconnect.

## Steps to Use

### 1. **Connect Devices to the Same Wi-Fi Network**

Ensure all devices you want to share files with are connected to the same Wi-Fi network. The app works locally, so all devices must be on the same network.

### 2. **Access the Web App**

- Open a web browser on any device connected to the Wi-Fi network.
- Enter the IP address and port of the server hosting the web app. For example: `http://192.168.1.10:3000`.

### 3. **Enter Your Device Name**

- Upon loading the web app, you will be prompted to enter a name for your device. This name will be visible to other users when you share files.
- Enter a name that easily identifies your device (e.g., "John's Laptop" or "Office Phone").

### 4. **View Connected Devices**

- After entering your device name, you will see a list of all devices currently connected to the app.
- The list will update in real-time as new devices connect or disconnect.

### 5. **Upload a File**

- To share a file, use the file upload form:
  1. Click the "Choose File" button and select the file you want to share.
  2. Click "Upload" to upload the file to the server.
- Once the file is uploaded, it will be listed in the "Available Files" section, along with the name of your device as the file's sharer.

### 6. **Download Files**

- All shared files are listed under the "Available Files" section.
- Each file entry includes:
  - **File Name:** The name of the file.
  - **Shared By:** The device name of the user who uploaded the file.
- Click on the file name to download the file to your device.

### 7. **Disconnecting**

- When you close the web app or disconnect from the Wi-Fi network, your device will be removed from the list of connected devices.
- If all devices disconnect, the server will automatically clear the uploaded files directory.

## Additional Information

- **Security:** The app is designed for use on local networks. Ensure you're connected to a secure and trusted Wi-Fi network when using the app.
- **Privacy:** Device names and file names are visible to all connected users. Avoid using sensitive information in device names or file names.

## Troubleshooting

- **Cannot Access the Web App:** Ensure your device is connected to the correct Wi-Fi network and that you’re using the correct IP address and port.
- **Files Not Uploading:** Check the file size and format. Some browsers may have restrictions on certain file types or sizes.

---

_Made with 🧠 by LuckyGoswami_
