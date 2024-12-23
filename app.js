// Import the required modules
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const { hostname } = require('os');

// Create the Express application
const app = express();

// Use Morgan for logging requests
app.use(morgan('dev'));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Retrieve environment variables
const HOSTNAME = process.env.HOSTNAME || 'default-host';
const LOCAL_ADDRESS = process.env.LOCAL_ADDRESS || 'UNKNOWN';
const APP_PORT = process.env.APP_PORT || 3000;

// Read the file to extract node PK and node alias
let nodePK = 'unavailable';
let nodeAlias = 'unavailable';
let hostNameEnv = HOSTNAME;
let hostName = hostname();

try {
  console.log(`Reading local address file: ${LOCAL_ADDRESS}`);
  const localContent = fs.readFileSync(LOCAL_ADDRESS, 'utf8');
  // Example file content: "0xai_AhsgqiqJZzav1OHUlam7K9tZWysPv1QWcZU0AhFJ6wsJ  nen-aid03"
  // Splitting by whitespace
  const [pk, alias] = localContent.split(/\s+/);
  nodePK = pk;
  nodeAlias = alias;
} catch (err) {
  console.error('Error reading local address file:', err.message);
}


// Endpoint to return node address info in JSON
app.get('/edgenode', (req, res) => {
  res.json({
    nodePK,
    nodeAlias,
    hostNameEnv,
    hostName
  });
});

// Start the server

app.listen(APP_PORT, '0.0.0.0', () => {
  console.log(`Server is running on ${hostNameEnv} (${hostName}), port ${APP_PORT}`);
});
