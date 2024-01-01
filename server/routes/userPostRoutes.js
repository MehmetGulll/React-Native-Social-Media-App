const express = require('express');
const router = express.Router();
const userPostController = require('../controllers/userPostController');


router.get('/getUserPosts/:username', userPostController.getUserPost);
module.exports=router;