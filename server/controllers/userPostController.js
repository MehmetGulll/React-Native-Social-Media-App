const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

exports.getUserPost = async (req, res) => {
  try {
    const username = req.params.username;
    const posts = await Post.find({ username: username });
    res.json(posts);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Failed to fetch user's posts" });
  }
};
