const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');

router.post('/follow', followController.followUser);
router.delete('/unfollow', followController.deleteFollowUser);
router.post('/isFollowing', followController.checkFollow);

module.exports = router;