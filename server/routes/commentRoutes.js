const express = require('express');

const router = express.Router();
const commentsControll = require('../controllers/commentsController')

router.post('/addComment',commentsControll.addComments);
router.get('/getComments/:postId',commentsControll.getComments);

module.exports = router;
