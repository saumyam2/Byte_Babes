const mongoose= require('mongoose')
const validator=require('validator')
const Schema=mongoose.Schema

const userSchema=new Schema({
    username:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new error("Invalid e-mail id")
            }
        }
    },
    mobileno:{
        type:Number,
        unique:true,
    },
})

module.exports=mongoose.model('User',userSchema)