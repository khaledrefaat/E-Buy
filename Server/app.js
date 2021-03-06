const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongooseKey = require('./config/keys');

const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', shopRoutes);

app.use((err, req, res, next) => {
  res.status(err.code || 500);
  res.json({ message: err.message || 'An unknown error occurred!' });
});

mongoose
  .connect(mongooseKey.mongoUri)
  .then(() => app.listen(9000))
  .catch(err => console.log(err));
