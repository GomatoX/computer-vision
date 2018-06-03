import WebSocket from 'ws';
import FaceDetector from './modules/FaceDetector.js';

const wss = new WebSocket.Server({
  port: 2020
});

wss.on('connection', function connection(ws) {
  ws.on('message', async function incoming(message) {
    const data = JSON.parse(message);
    if (data.type === 'image') {
      const detector = new FaceDetector();
      const results = await detector.detect(
        Buffer.from(data.data.split(',').pop(), 'base64')
      );

      ws.send(
        JSON.stringify({
          type: 'results',
          data: results
        })
      );
    }
  });
});
