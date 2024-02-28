const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profileImage:{
    type:String
  },
  coverImage:{
    type:String
  },
  blockedUsers:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }]
});

module.exports = mongoose.model("User", UserSchema);
