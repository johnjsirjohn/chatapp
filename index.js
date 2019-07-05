const express = require('express');
const Sse = require('json-sse');
const bodyParser = require('body-parser');
const cors = require('cors');
//initialize the server
const app = express();

//Reg the middleware
app.use(cors());
const jsonParser = bodyParser.json();
app.use(jsonParser);

//our data store - bascically the database for now
const messages = ['hello', 'Can you see this?'];

const json = JSON.stringify(messages);

//initialize the event source
const stream = new Sse(json);

//Listen for new clients
function onStream(request, response) {
  stream.init(request, response); //register the client with the stream
}

app.get('/stream', onStream);

//listen for new messages
function onMessage(request, response) {
  //Destructure the usr's message
  const { message } = request.body;
  //add it to the store
  messages.push(message);
  //reserialize the store
  const json = JSON.stringify(messages);

  //update the initial date
  stream.updateInit(json);

  //Notify all the clients
  stream.send(json);
  //semd a response
  return response.status(201).send(message);
}

app.post('/message', onMessage);

const port = 5000;

function onlisten() {
  console.log(`Listening on: ${port}`);
}
app.listen(port, onlisten);
