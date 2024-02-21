const express = require('express');
const router = express.Router();
const userPostController = require('../controllers/userPostController');


router.get('/getUserPosts/:username', userPostController.getUserPost);
router.get('/getUserImages/:userId', userPostController.getUserImages);
module.exports=router;