const express = require('express');
const dotenv = require('dotenv');
const ip = require('ip');
const path = require('path');

const logger = require('./logger');

const addProdMiddlewares = require('./middlewares/addProdMiddlewares');
const addDevMiddlewares = require('./middlewares/addDevMiddlewares');

//const argv = require('minimist')(process.argv.slice(2));
dotenv.config();

const ROOT_PATH = path.resolve(process.cwd());
// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = process.env.HOST || ip.address();
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// use the gzipped bundle
/* app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
}); */

// In production we need to pass these values in instead of relying on webpack
if (process.env.NODE_ENV === 'production') {
  addProdMiddlewares(app);
} else {
  addDevMiddlewares(app);
}


app.listen(port, 'localhost', async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (host) {
    logger.appStarted(port, prettyHost);
  } else {
    logger.appStarted(port, 'localhost');
  }
  
});

// Start your app.
if (host) {
  app.listen(port, host, async err => {
    if (err) {
      return logger.error(err.message);
    }
  });
} 

app.use(express.json());