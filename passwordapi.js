const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');


const db = require('./DatabaseInfo/dbConfig');
const Users = require('./Users/basicUsersModel');
const restricted = require('./Authentication/auth-middleware');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());


server.post('/api/register', (req, res) => {
  console.log(req.body);
  let { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 8); // it's 2 ^ 8, not 8 rounds

  Users.add({ username, password: hash })
    .then(saved => {
      console.log(saved)
      res.status(201).json(saved);

    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'You cannot pass!' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/api/users', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/hash', (req, res) => {
  const name = req.query.name;

  // hash the name
  const hash = bcrypt.hashSync(name, 8); // use bcryptjs to hash the name
  res.send(`the hash for ${name} is ${hash}`);
});

module.exports = server;