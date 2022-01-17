const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connect = require('./config/db');
const restRouter = require('./api/index');
const cookieParser = require('cookie-parser');
const mongoSanitizer = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const logger = require('./api/middleware/logger');
const cors = require('cors');

//load environment variables
dotenv.config({ path: '/.env' });

connect();

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

//Tell Express where we keep our index.ejs
app.set('views', __dirname + '/views');

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
console.log('test');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ORIGIN || `*`);
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie'
  );

  next();
});

// app.use((req, res, next) => {
//   res.set({
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT',
//     'Access-Control-Allow-Headers': 'Content-Type,Authorization'
//   });
//   next();
// });

app.use(express.json());
app.use(cookieParser());

app.use(logger);

//Sanitize against no sql injection
app.use(mongoSanitizer());

//Set security header
// app.use(helmet());
helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: ["'self'"],
    frameSrc: ["'self'"],
    childSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://pro-api.coinmarketcap.com/'
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://pro-api.coinmarketcap.com/'
    ],
    fontSrc: [
      "'self'",
      'https://pro-api.coinmarketcap.com/',
      'https: data:',
      'https://pro-api.coinmarketcap.com/'
    ],
    imgSrc: ["'self'", 'data:'],
    baseUri: ["'self'"]
  }
});

//Prevent inserting scripts to the server
app.use(xss());

//limiting how many request a user can send per 10 mins
const limiter = rateLimit({
  windowMs: 10 * 60 * 100,
  max: 100
});
app.use(limiter);

//prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// // Enable cors
// app.use(cors({ credentials: true, origin: `http://localhost:3000` }));

app.use('/api/v1', restRouter);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.message = 'Invalid route';
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    error: {
      message: error.message
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening ${process.env.NODE_ENV} on port ${PORT}!`);
});
