const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { mongoose, url } = require('./models');

const PORT = process.env.PORT || 3000;
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', require('./routes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

mongoose
  .connect(url)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB Connected and server running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  });
