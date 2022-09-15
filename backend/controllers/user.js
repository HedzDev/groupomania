const fs = require('fs');

const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.getOneUser = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);
  User.find({ _id: req.params.id })
    .select('-password')
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => res.status(400).json(error));
};

exports.modifyUser = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (user && user.id === req.auth.userId) {
        if (!req.body.password && !req.file) {
          User.updateOne(
            { _id: req.params.id },
            {
              email: req.body.email,
              bio: req.body.bio,
            }
          )
            .then(() => res.status(200).json({ message: 'User modified !' }))
            .catch((error) => res.status(500).json({ error }));
        } else if (!req.body.password && req.file) {
          User.updateOne(
            { _id: req.params.id },
            {
              email: req.body.email,
              bio: req.body.bio,
              picture: `${req.protocol}://${req.get(
                'host'
              )}/client/public/uploads/${req.file.filename}`,
            }
          )
            .then(() => res.status(200).json({ message: 'User modified !' }))
            .catch((error) => res.status(500).json({ error }));
        } else if (req.body.password && req.file) {
          bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
              User.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    email: req.body.email,
                    password: hash,
                    bio: req.body.bio,
                    picture: `${req.protocol}://${req.get(
                      'host'
                    )}/client/public/uploads/${req.file.filename}`,
                  },
                }
              )
                .then(() =>
                  res.status(200).json({ message: 'User modified !' })
                )
                .catch((error) => res.status(500).json({ error }));
            })
            .catch((error) => res.status(500).json({ error }));
        } else {
          bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
              User.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    email: req.body.email,
                    password: hash,
                    bio: req.body.bio,
                  },
                }
              )
                .then(() =>
                  res.status(200).json({ message: 'User modified !' })
                )
                .catch((error) => res.status(500).json({ error }));
            })
            .catch((error) => res.status(500).json({ error }));
        }
      } else {
        return res.status(401).json({ message: 'Not allowed!' });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.body.userId))
    return res.status(400).json('Unknown ID : ' + req.body.userId);
  try {
    const user = await User.findById(req.body.userId);
    await user.remove();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Invalid request !' });
  }
};

exports.followUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.auth.userId))
    return res.status(400).json('Unknown ID : ' + req.params.id);
  try {
    if (req.auth.userId === req.params.id) {
      return res.status(400).json({ message: 'User can not follow himself !' });
    } else {
      await User.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { followers: req.auth.userId },
        },
        { new: true, upsert: true }
      )
        .then((data) => res.json(data))
        .catch((error) => res.status(400).json({ message: error }));

      await User.findByIdAndUpdate(
        req.auth.userId,
        {
          $addToSet: { following: req.params.id },
        },
        { new: true, upsert: true }
      )
        .then((data) => res.json(data))
        .catch((error) => res.status(400).json({ message: error }));
    }
  } catch (error) {
    res.status(500).json({ error: 'Invalid request !' });
  }
};

exports.unfollowUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.auth.userId))
    return res.status(400).json('Unknown ID : ' + req.params.id);

  try {
    await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { followers: req.auth.userId },
      },
      { new: true, upsert: true }
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json({ message: error }));

    await User.findByIdAndUpdate(
      req.auth.userId,
      {
        $pull: { following: req.params.id },
      },
      { new: true, upsert: true }
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json({ message: error }));
  } catch (error) {
    res.status(500).json({ error: 'Invalid request !' });
  }
};
