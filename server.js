const express = require('express');
const app = express();
const path = require('path');
const os = require('os');

// Function to get the IP address of the current device
function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const interface in interfaces) {
    const addresses = interfaces[interface];
    for (const address of addresses) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return '127.0.0.1'; // Default to localhost if unable to determine IP address
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route handler for the root URL
app.get('/', (req, res) => {
  // Send the index.html file
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3001; // Use the port provided by the environment or default to 3001
const IP_ADDRESS = getIPAddress(); // Get the current device's IP address dynamically
app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server is running on http://${IP_ADDRESS}:${PORT}`);
});
