const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongooseKey = require('./config/keys');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(mongooseKey.mongoUri)
  .then(() => app.listen(9000))
  .catch(err => console.log(err));
