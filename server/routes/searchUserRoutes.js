const express = require('express');
const router = express.Router();
const searchUserController = require('../controllers/searchUserController');

router.get("/searchUser/:username",searchUserController.getUsers)

module.exports = router;