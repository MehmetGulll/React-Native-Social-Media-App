const express = require('express');
const requestMessageController = require('../controllers/requestMessagesController');
const router = express.Router();

router.get('/getRequestMessages', requestMessageController.getRequestMessage);

module.exports = router;