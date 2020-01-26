const spawn = require('child_process').spawn;
const os = require('os');
const Through = require('audio-through');

module.exports = () => {
  const p = spawn('arecord', [
    '-c', '2', // 2 channels
    '-r', '44100', // 44100Hz sample rate
    '-f', 'S16_LE', // little endian 16 bit
    '-D', 'plughw:1,0',
    '--buffer-size=16384'
  ]);
  const through = new Through();
  const res = p.stdout.pipe(through);

  const killed = false;
  res.stop = function stop (cb) {
    killed = true;
    p.kill('SIGTERM');
    p.once('exit', cb);
  };

  p.once('exit', function onStop (code) {
    if (!killed && code !== 0) {
      p.emit('error', new Error('Recorder exited with ' + code + '.'));
    } else {
      p.stdout.unpipe(through);
    }
    through.end();
  });

  return res;
};
