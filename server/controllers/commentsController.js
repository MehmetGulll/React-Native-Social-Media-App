const express = require("express");
const Comment = require("../models/Comment");

exports.addComments = async (req, res) => {
  const { postId, userId, content } = req.body;
  const comment = new Comment({
    postId,
    userId,
    content,
  });

  try {
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.log("Error", error);
  }
};

exports.getComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId }).populate({
      path: "userId",
      select: "firstname lastname",
    });
    res.status(200).json(comments);
  } catch (error) {
    console.log("Error", error);
  }
};
