const express = require('express');
const RequestMessage = require('../models/RequestMessages');
const Message = require('../models/Message')
const Follow = require('../models/Follow')

exports.sendMessage = async(req,res)=>{
    const message = new Message(req.body);
    await message.save();

    const isFollowing = await Follow.findOne({
        follower:req.body.receiver,
        followee:req.body.sender
    });
    if(!isFollowing){
        const requestMessage = new RequestMessage(req.body);
        await requestMessage.save();

    }
    res.send(message);
}

exports.getRequestMessage = async(req,res)=>{
    const requestMessages = await RequestMessage.find({receiver:req.query.userId});
    res.send(requestMessages);
    
}