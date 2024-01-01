const express = require('express');
const multer = require('multer');
const postController = require('../controllers/postController');

const router = express.Router();

const upload = multer({dest:'public/'})

router.post('/addPost',upload.single('photo'),postController.addPost);
router.get('/getPost', postController.getPost);
router.post('/getFollowedUsersPosts', postController.getFollowedUsersPosts);
router.delete('/deletePost/:id', postController.deletePost);
router.post('/posts/:postId/like',postController.postLike);
router.post('/posts/:postId/unlike',postController.postUnLike);


module.exports = router;
