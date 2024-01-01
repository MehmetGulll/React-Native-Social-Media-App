const express = require('express');
const imagesController = require('../controllers/imageController');
const router = express.Router();

router.get('/getImages/:path',imagesController.images);

module.exports = router;