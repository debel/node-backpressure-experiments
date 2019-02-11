const process = require('process');

let requestsInProgrss = 0;
const getNumberOfRequestsInProgrss = () => requestsInProgrss;
const inc = () => { requestsInProgrss += 1; }
const dec = () => { requestsInProgrss -= 1; }
const countRequestsInProgress = (req, res, next) => {
  inc();
  res.on('abort', dec);
  res.on('finish', dec);
  next();
};

const measureRequests = callback => (req, res, next) => {
  const start = process.hrtime();
  res.on('close', () => callback(process.hrtime(start)));
  res.on('finish', () => callback(process.hrtime(start)));
  next();
};

const measureEventLoopLag = (resolution, threshold, onLag) => {
  let lastInterval = process.hrtime();
  const timer = setInterval(() => {
    const diff = process.hrtime(lastInterval);
    const diffInMs = diff[0] * 1e3 + diff[1] / 1e6;
    const hasLag = diffInMs > resolution * threshold;
    lastInterval = process.hrtime();
    if (hasLag) { onLag(diffInMs - resolution); }
  }, resolution);

  return () => clearInterval(timer);
};

module.exports = {
  measureRequests,
  countRequestsInProgress,
  getNumberOfRequestsInProgrss,
  measureEventLoopLag
};
