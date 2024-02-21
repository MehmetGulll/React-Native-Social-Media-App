const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User")

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

exports.getUserImages = async(req,res)=>{
  try {
    const user = await User.findById(req.params.userId);
    if(!user){
      return res.status(404).json({error:'User is not found'});
    }
    res.json({profileImage: user.profileImage, coverImage: user.coverImage});
  } catch (error) {
    console.log("Error",error);
  }
}
