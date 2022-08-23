const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');

//Posts
router.get('/:id', auth, postCtrl.readPost);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, multer, postCtrl.deletePost);
router.patch('/like/:id', auth, postCtrl.likePost);
router.patch('/unlike/:id', auth, postCtrl.unlikePost);

//Comments
router.patch('/comment-post/:id', auth, postCtrl.commentPost);
// router.patch('/edit-comment-post/:id', auth, postCtrl.editCommentPost);
router.patch('/delete-comment-post/:id', auth, postCtrl.deleteCommentPost);

module.exports = router;
