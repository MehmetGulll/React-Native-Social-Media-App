const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async(req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const user = new User({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            password:hashedPassword,
            gender:req.body.gender
        })
        const savedUser= await user.save();
        res.json(savedUser);
    } catch (error) {
        console.log("Error",error);
    }
}

exports.login = async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.json({error:'Kullanıcı Bulunamadı'});
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            return res.json({error:'Kullanıcı Bulunamadı'});
        }
        const username = user.firstname+' '+ user.lastname;
        const currentId = user._id;
        const token = jwt.sign({_id:user._id},"yourKey")
        res.header('auth-token',token).json({message:"Giriş Başarılı",username:username, currentId : currentId, token:token});
    } catch (error) {
        console.log("Error",error)
    }
}

exports.logout = async(req,res)=>{
    try {
        res.header('auth-token','').json({message:"Log out successfly"});
    } catch (error) {
        console.log("Error",error);
    }
}
