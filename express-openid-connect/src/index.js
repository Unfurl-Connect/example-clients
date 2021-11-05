require('dotenv').config()
const express = require('express');

const { app } = require('./app')
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((error, req, res, next) => {
  res.status(error.status || 500).render('error', {error})
  next(error)
});

const https = require('https');
const fs = require('fs');
const key = fs.readFileSync('../../../certs/dataunbound.co.uk.key');
const cert = fs.readFileSync('../../../certs/dataunbound.co.uk.crt');
const server = https.createServer({key: key, cert: cert }, app);
server.listen(process.env.CLIENT_PORT, () =>
  console.log(`Example app started at ${process.env.BASE_URL}`)
);