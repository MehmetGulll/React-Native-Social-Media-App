const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender:String,
    receiver:String,
    content:String,
    read:{type:Boolean, default:false},
})

module.exports = mongoose.model("Messages",MessageSchema)