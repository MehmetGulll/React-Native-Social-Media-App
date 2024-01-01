const express = require("express");
const User = require("../models/User");

exports.getUsers = async (req, res) => {
    try {
      const searchTerm = req.params.username;
      if (searchTerm.length < 3) {
        return res.json([]);
      }
      const users = await User.find({
        $or: [
          { username: { $regex: searchTerm, $options: "i" } },
          { firstname: { $regex: searchTerm, $options: "i" } }
        ]
      });
      res.json(users);
    } catch (error) {
      console.log("Error", error);
      res.status(500).json({ message: "Failed to search user" });
    }
  };
  
