const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    username:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }]
})

module.exports = mongoose.model('Post',PostSchema);