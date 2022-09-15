const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const password = require('../middleware/password');

const userCtrl = require('../controllers/user');
const authCtrl = require('../controllers/auth');
const uploadCtrl = require('../controllers/upload');

/* AUTH */
router.post('/signup', password, authCtrl.signup);
router.post('/login', authCtrl.login);
router.get('/logout', auth, authCtrl.logout);

/* USER */
router.get('/', userCtrl.getAllUsers);
router.get('/:id', userCtrl.getOneUser);
router.put('/:id', auth, multer, userCtrl.modifyUser);
router.delete('/', auth, userCtrl.deleteUser);
router.patch('/follow/:id', auth, userCtrl.followUser);
router.patch('/unfollow/:id', auth, userCtrl.unfollowUser);

/** UPLOAD */
router.post('/upload', multer, uploadCtrl.uploadProfil);

module.exports = router;
