const User = require('../model/user')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const register = async (req,res)=>{
    try{
        const user=new User({
            username:req.body.username,
            password:req.body.password,
            email:req.body.email,
            mobileno:req.body.mobileno,
        })
        user.password=await bcrypt.hash(user.password, 10)
        const user1=await user.save()
        res.send("Sign up done successfully")
    }
    catch(error){
        res.status(500).send(error)
    }
}

const log= async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password

        const user=await User.findOne({email:email})
        if(user){
            const validpassword= await bcrypt.compare(password, user.password)
            if(validpassword){
                const token=jwt.sign({_id:user._id},process.env.TOKEN_KEY,{expiresIn: "24h"})
                res.json({token,user});
            }else{
                return res.send("Incorrect")
            }
        }
        else{
            return res.status(201).send("User not found")
        }

    }
    catch(error){
        res.status(500).send(error)
    }
}

const getusers=async(req,res)=>{
    try {
        const user=await User.find()
        res.json(user)
    } catch (error) {
        res.send("Error")
    }
}
const deleteuser=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id)
        const u1=await user.deleteOne()
        res.send("User deleted successfully")
    } catch (error) {
        res.status(500).send("Error in deleting user")
    }
}
const getuserName = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('username');
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ username: user.username });
    } catch (error) {
        res.status(500).send("Error fetching username");
    }
};
const updateuser=async(req,res)=>{
    try {
        const user=await User.findByIdAndUpdate(req.user._id,req.body,)
        res.send("Update done")
    } catch (error) {
        res.status(500).send("Upadation not done")
    }
}
module.exports ={
    register,
    log,
    deleteuser,updateuser,getusers,getuserName
}