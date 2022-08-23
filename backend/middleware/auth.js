const jwt = require('jsonwebtoken');
require('dotenv').config;
const User = require('../models/User');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.id;
    req.auth = { userId };
    console.log(req.auth);
    User.findOne({ _id: userId })
      .then((user) => {
        console.log(userId);
        if (user.id === userId) {
          next();
        } else {
          throw 'Authentification failed';
        }
      })
      .catch((error) => req.status(404).json({ error }));
  } catch {
    res.status(401).json({
      message: 'Invalid authentification token !',
    });
  }
};
