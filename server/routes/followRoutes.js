const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');

router.post('/follow', followController.followUser);
router.delete('/unfollow', followController.deleteFollowUser);
router.post('/isFollowing', followController.checkFollow);
router.post('/getFollowerCount',followController.getFollowerCount);
router.post('/getFollowingCount',followController.getFollowingCount);

module.exports = router;