const express = require('express');
const redis = require('redis');
const process = require('process');

const app = express();
const client = redis.createClient({
  host: 'redis-server',
  port: 6379,
});

client.get('visits', (err, visits) => {
  // data is null if the key doesn't exist
  if(err || visits === null) {
    client.set('visits', 0);
  }
});

app.get('/', (req, res) => {
  client.get('visits', (err, visits) => {
    res.send('Number of visits ' + visits);
    client.set('visits', parseInt(visits) + 1);
    (parseInt(visits) + 1) % 3 == 0 && process.exit(1);
  });
});

app.listen(8081, () => {
  console.log('listening on port 8081');
});
