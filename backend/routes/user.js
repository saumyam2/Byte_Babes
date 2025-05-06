const {register} = require('../controller/user')
const {log,deleteuser,updateuser,getusers,getuserName}= require('../controller/user')
const authenticatetoken=require('../middleware/authenticate')
const express = require('express')
const router = express.Router()

router.post('/signup',register)
router.post('/login',log)
router.delete('/deleteuser',authenticatetoken,deleteuser)
router.patch('/updateuser',authenticatetoken,updateuser)
router.get('/getusers',authenticatetoken,getusers)
router.get('/getusername',authenticatetoken,getuserName)

module.exports = router 