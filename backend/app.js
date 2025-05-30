const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const app=express()
require("dotenv").config()

const port=process.env.PORT || 8085
app.use(express.json())
app.use(cors({origin:"*"}))

const url=process.env.DB_URL
const dbconnect= async()=>{
    await mongoose.connect(url).then(()=>{
        console.log('connected')
      }).catch((err)=>{
        console.log(err)
      })
}
dbconnect()
app.listen(port,()=>{
    console.log("Running on port")
})

const userRouter = require('./routes/user')
app.use('/user',userRouter)

const chatbotRouter = require('./routes/chatbot')
app.use('/chatbot',chatbotRouter)

const feedbackRouter = require('./routes/feedback')
app.use('/feedback',feedbackRouter)

const jobsRouter = require('./routes/fetchjobs')
app.use('/jobs',jobsRouter)

const eventsRouter = require('./routes/getevents')
app.use('/events',eventsRouter)

const mentorsRouter = require('./routes/fetchmentors')
app.use('/mentors',mentorsRouter)

const voicechatRouter = require('./voicechat');
app.use('/voicechat', voicechatRouter);

module.exports=app