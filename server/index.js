'use strict';

// Basic express setup:
// process.env.PORT is required by Heroku to set arbitrary port
const PORT          = process.env.PORT || 5000;
const express       = require('express');
const bodyParser    = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const path          = require('path');
const app           = express();
const {MongoClient} = require('mongodb');
const MONGODB_URI   = process.env.MONGODB_URI || 'mongodb://localhost:27017/tweeter';

console.log('Connecting to:', MONGODB_URI);

app.use(sassMiddleware({
  src: path.join(__dirname, '../sass'),
  dest: path.join(__dirname, '../public/styles'),
  debug: true,
  outputStyle: 'expanded',
  prefix: '/styles'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const dataHelpersFactory  = require('./lib/data-helpers.js');
const tweetsRoutesFactory = require('./routes/tweets');
const usersRoutesFactory = require('./routes/users');

MongoClient.connect(MONGODB_URI).then(db => {

  const DataHelpers  = dataHelpersFactory(db);
  const tweetsRoutes = tweetsRoutesFactory(DataHelpers);
  const usersRoutes  = usersRoutesFactory(DataHelpers);

  app.use('/tweets', tweetsRoutes);
  app.use('/users', usersRoutes);

  app.listen(PORT, () => {
    console.log('Tweeter app listening on port ' + PORT);
  });
}).catch((err) => {
  console.error(`Failed to connect to ${DATABASE_URL}`);
  throw err;
});