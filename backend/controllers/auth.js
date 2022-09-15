const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cryptoJs = require('crypto-js');
const User = require('../models/User');
require('dotenv').config();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN);
};

exports.signup = (req, res, next) => {
  const cryptedEmail = cryptoJs
    .HmacSHA256(req.body.email, process.env.SECRET_EMAIL_KEY)
    .toString();
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        pseudo: req.body.pseudo,
        email: cryptedEmail,
        password: hash,
      });
      user
        .save()
        .then(() => {
          res.status(201).json({ message: 'User created' });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const cryptedEmail = cryptoJs
    .HmacSHA256(req.body.email, process.env.SECRET_EMAIL_KEY)
    .toString();
  User.findOne({ email: cryptedEmail })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'User not found !' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Wrong password !' });
          } else {
            const token = createToken(user.id);
            console.log(user.id);
            res.cookie('jwt', token, {
              maxAge: 1 * 60 * 60 * 24 * 1000,
              httpOnly: true,
            });
            res.status(200).json({
              userId: user.id,
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json(error));
};

exports.logout = (req, res, next) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
