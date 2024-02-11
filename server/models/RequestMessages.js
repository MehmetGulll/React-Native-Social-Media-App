const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestMessageSchema = new Schema({
    sender:String,
    receiver:String,
    content:String,
    read:{type:Boolean, default:false}
})

module.exports = mongoose.model("RequestMessage",RequestMessageSchema);