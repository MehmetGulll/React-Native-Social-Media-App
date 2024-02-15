const express = require("express");
const router = express.Router();
const recentChatsController = require("../controllers/recentChatsController");

router.post("/storeRecentChat", recentChatsController.storeRecentChat);
router.get("/getRecentChat", recentChatsController.getRecentChat);

module.exports = router;
