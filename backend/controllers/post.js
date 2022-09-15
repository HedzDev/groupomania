const Post = require('../models/Post');
const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const fs = require('fs');

let isAdmin = (req) => {
  return User.findOne({ _id: req.auth.userId })
    .then((user) => {
      console.log('userIsAdmin');
      console.log(user.admin);
      return user.admin;
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};

exports.readPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json(error));
};

exports.readAllPosts = (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json(error));
};

exports.createPost = (req, res) => {
  const newPost = new Post({
    userId: req.auth.userId,
    message: req.body.message,
    likers: [],
    comments: [],
  });
  if (req.file) {
    newPost = new Post({
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/client/public/uploads/${
        req.file.filename
      }`,
      message: req.body.message,
      likers: [],
      comments: [],
    });
  }
  newPost
    .save()
    .then(() => res.status(201).json({ message: 'Post created !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyPost = (req, res, next) => {
  const updatedRecord = req.file
    ? {
        message: req.body.message,
        imageUrl: `${req.protocol}://${req.get('host')}/client/public/uploads/${
          req.file.filename
        }`,
      }
    : { message: req.body.message };

  Post.findOne({ _id: req.params.id })
    .then((post) => {
      let userAdmin = isAdmin(req);
      userAdmin.then((isAdmin) => {
        if (post.userId === req.auth.userId || isAdmin) {
          if (post.imageUrl == undefined) {
            Post.updateOne({ _id: req.params.id }, { $set: updatedRecord })
              .then(() => res.status(200).json('Post updated !'))
              .catch((err) => res.status(400).json({ message: err }));
          } else {
            console.log(post.imageUrl);
            const filename = post.imageUrl.split('/uploads/')[1];
            fs.unlink(`/client/uploads/${filename}`, () => {
              Post.updateOne({ _id: req.params.id }, { $set: updatedRecord })
                .then(() => res.status(200).json('Post updated !'))
                .catch((err) => res.status(400).json({ message: err }));
            });
          }
          console.log(post);
        } else {
          return res.status(401).json({ message: 'Unauthorized !' });
        }
      });
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });
};

exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      let userAdmin = isAdmin(req);
      userAdmin.then((isAdmin) => {
        if (post.userId === req.auth.userId || isAdmin) {
          if (post.imageUrl) {
            const filename = post.imageUrl.split('/uploads/')[1];
            fs.unlink(`/client/uploads/${filename}`, () => {
              Post.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json('Post deleted !'))
                .catch((err) => res.status(400).json({ message: err }));
            });
          } else {
            Post.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json('Post deleted !'))
              .catch((err) => res.status(400).json({ message: err }));
          }
        } else {
          return res.status(401).json({ message: 'Unauthorized !' });
        }
      });
    })
    .catch((err) => res.status(400).json({ message: err }));
};

exports.likePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);
  try {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.auth.userId },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.auth.userId,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true }
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json({ message: error }));
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.unlikePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);
  try {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.auth.userId },
      },
      { new: true }
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json({ message: error }));

    await User.findByIdAndUpdate(
      req.auth.userId,
      {
        $pull: { likes: req.params.id },
      },
      { new: true }
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json({ message: error }));
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.commentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);

  try {
    return Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.auth.userId,
            commenterPseudo: req.auth.pseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json({ message: error }));
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.deleteCommentPost = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);

  try {
    return Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (error, data) => {
        if (!error) res.status(200).json(data);
        else return res.status(400).json({ message: error });
      }
    );
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// exports.editCommentPost = (req, res, next) => {
//   if (!ObjectId.isValid(req.params.id))
//     return res.status(400).json('Unknown ID : ' + req.params.id);
//   try {
//     return Post.findById(req.params.id, (error, data) => {
//       const commentToEdit = data.comments.find((comment) =>
//         comment._id.equals(req.body.commentId)
//       );
//       console.log(commentToEdit);
//       if (!commentToEdit)
//         return res.status(404).json('Comment not found : ' + error);
//       commentToEdit.text = req.body.text;

//       return data.save((error) => {
//         if (!error) return res.status(200).json(data);
//         return res.status(500).json({ message: error });
//       });
//     });
//   } catch (error) {
//     return res.status(400).json({ message: error });
//   }
// };
