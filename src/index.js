const path = require('path');
const express = require('express');
const createMic = require('./mic');
const lame = require('lame');

const create = ({
  name,
  port,
}) => {
  const mic = createMic();
  const encoder = new lame.Encoder({
    channels: 2,
    bitDepth: 16,
    sampleRate: 44100,
    bitRate: 320,
    outSampleRate: 44100,
    mode: lame.STEREO,
  });
  const audio = mic.pipe(encoder);
  const app = express();

  app.use('/', express.static(path.join(__dirname, '../public')));

  app.get('/stream', (request, response) => {
    response.contentType('audio/mpeg');
    response.set('Transfer-Encoding', 'chunked');
    response.set('Content-Disposition', 'attachment; filename=stream.mp3');
    response.flushHeaders();
    audio.on('data', (data) => {
      response.write(data);
    });
  });

  app.get('/info', (request, response) => {
    response.json({
      name,
    });
  });

  app.get('/', (req, res) => {
    res.end(`
      <html>
        <body>
          <audio controls src="./stream" />
        </body>
      </html>
    `);
  });

  app.listen(port, () => {
    console.log('Server running on port ' + port);
  });
};

create({
  name: 'record-player',
  port: 5005,
});

module.exports = create;
