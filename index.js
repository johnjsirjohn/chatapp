const express = require('express');
const Sse = require('json-sse');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const MessagesRouter = require('./messages/router');

// Initialize the server
const app = express();

// Register middleware

// Allow cross-origin resource sharing
app.use(cors());

// Read request JSON bodies
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(MessagesRouter);

// Our data store - basically the database for now
//const messages = ['hello', 'can you see this?'];
const messages = [];

// Serialize the data
const json = JSON.stringify(messages);
console.log('JSOn from index', json);

// Initialize the event source
const stream = new Sse(json);

// Listen for new clients
function onStream(request, response) {
  stream.init(request, response);
}
app.get('/stream', onStream);

// Listen for new messages
function onMessage(request, response) {
  // Destructure the user's message
  const { message } = request.body;

  // Add it to the store
  messages.push(message);

  // Reserialize the store
  const json = JSON.stringify(messages);

  // Update the initial data
  stream.updateInit(json);

  // Notify all the clients
  stream.send(json);

  // Send a response
  return response.status(201).send(message);
}
app.post('/message', onMessage);

// Start the server on the right port
const port = process.env.PORT || 5000;
function onListen() {
  console.log(`Listening on :${port}`);
}
app.listen(port, onListen);
