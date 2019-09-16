const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const server = require('./passwordapi')

const db = require('./DatabaseInfo/dbConfig');
const Users = require('./Users/basicUsersModel');
const restricted = require('./Authentication/auth-middleware');

server.get('/', (req, res) => {
  res.send("Quietly waiting for content...!");
});


const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));

/*
  write a middleware that will check for the username and password
  and let the request continue to /api/users if credentials are good
  return a 401 if the credentials are invalid

  Use the middleware to restrict access to the GET /api/users endpoint
*/
