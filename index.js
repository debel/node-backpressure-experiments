const process = require('process');
const express = require('express');

const {
  measureRequests,
  countRequestsInProgress,
  requestsInProgrss,
  getNumberOfRequestsInProgrss,
  measureEventLoopLag,
} = require('./backpressure');

const app = express();

app.use(measureRequests((time) => console.log('request took', time)));
app.use(countRequestsInProgress);

app.get('/sync', (req, res) => {
  for (let z = 0; z < 1e10; z += 1) {}
  res.send('sync');
});

app.get('/async', (req, res) => {
  setTimeout(() => res.send('async'), 5000);
});

app.get('/reqs', (req, res) => {
  server.getConnections((err, count) =>
    res.send({
      node: count,
      me: getNumberOfRequestsInProgrss(),
    })
  );
});

measureEventLoopLag(2000, 1.2, (diff) => {
  console.log('lag', diff);
  console.log('i measure', getNumberOfRequestsInProgrss());
  server.getConnections((err, count) => console.log('node reports', count));
});

const server = app.listen(8077);
