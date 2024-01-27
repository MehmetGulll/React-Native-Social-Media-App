const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");

router.get("/getNotifications", notificationController.getNotifications);

module.exports = router;
