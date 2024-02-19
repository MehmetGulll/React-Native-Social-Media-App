const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");

const upload = multer({ dest: "public/" });

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/checkEmail", userController.checkEmail);
router.get("/logout", userController.logout);
router.post(
  "/uploadProfileImage",
  upload.single("photo"),
  userController.uploadProfileImage
);
router.get("/getProfileImage", userController.getProfileImage);
router.post(
  "/uploadCoverImage",
  upload.single("photo"),
  userController.uploadCoverImage
);

router.get("/getCoverImage", userController.getCoverImage);
module.exports = router;
