const express = require('express');
const messagesController= require('../controllers/messagesController');
const router = express.Router();

router.get('/getMessages',messagesController.getMessage);
router.post('/sendMessage',messagesController.sendMessage);

module.exports = router;