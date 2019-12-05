const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

import FaceDetector from './modules/FaceDetector';

const EVENTS = {
  VIDEO: 'Video'
};

io.on('connection', async socket => {
  console.log('User connected');
  const detector = new FaceDetector();

  socket.on(EVENTS.VIDEO, async data => {
    const results = await detector.detect(data);

    socket.compress(true).emit(EVENTS.VIDEO, results);
  });
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

http.listen(3001, function() {
  console.log('listening on *:3000');
});
