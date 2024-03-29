const express = require("express");
const Follow = require("../models/Follow");
const User = require('../models/User')
const Notification = require("../models/Notifications");

exports.followUser = async (req, res) => {
  const follow = new Follow({
    follower: req.body.follower,
    followee: req.body.followee,
  });

  try {
    const savedFollow = await follow.save();
    const notification = new Notification({
      follower: req.body.follower,
      followee: req.body.followee,
    });
    await notification.save();
    res.json(savedFollow);
  } catch (error) {
    console.log("Error", error);
    res.json({ message: error });
  }
};

exports.deleteFollowUser = async (req, res) => {
  try {
    const removedFollow = await Follow.deleteOne({
      follower: req.body.follower,
      followee: req.body.followee,
    });
    res.json(removedFollow);
  } catch (error) {
    console.log("Error", error);
    res.json({ message: error });
  }
};

exports.checkFollow = async (req, res) => {
  try {
    const follow = await Follow.findOne({
      follower: req.body.follower,
      followee: req.body.followee,
    });
    if (follow) {
      res.json({ isFollowing: true });
    } else {
      res.json({ isFollowing: false });
    }
  } catch (error) {
    console.log("Error", error);
    res.json({ message: error });
  }
};

exports.getFollowerCount = async (req, res) => {
  try {
    const followerCount = await Follow.countDocuments({
      followee: req.body.userId,
    });
    res.json({ followerCount });
  } catch (error) {
    console.log("Error", error);
    res.json({ message: error });
  }
};

exports.getFollowingCount = async (req, res) => {
  try {
    const followingCount = await Follow.countDocuments({
      follower: req.body.userId,
    });
    res.json({ followingCount });
  } catch (error) {
    console.log("Error", error);
    res.json({ message: error });
  }
};

exports.getFollowing = async(req,res)=>{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  try {
    // Engellenen kullanıcıların listesini al
    const currentUser = await User.findById(req.body.userId);
    const blockedUsers = currentUser.blockedUsers || []; // Eğer blockedUsers undefined ise, boş bir dizi kullan

    // Engellenen kullanıcıları filtrele
    const following = await Follow.find({
      follower: req.body.userId,
      followee: { $nin: blockedUsers } // Engellenen kullanıcıları dahil etme
    })
    .populate("followee")
    .skip(skip)
    .limit(limit);

    const totalFollowing = await Follow.countDocuments({
      follower: req.body.userId,
      followee: { $nin: blockedUsers } // Engellenen kullanıcıları dahil etme
    });

    const hasMore = totalFollowing > skip + following.length;
    res.json({following, hasMore, totalFollowing})
  } catch (error) {
    console.log("Error",error);
    res.json({message:error});
  }
}
