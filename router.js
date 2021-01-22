const config = require('config');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const {User, validate} = require('../server/server/shared/database/entities/User');
const express = require('express');
const router = express.Router();
const database = require ('./dbConnection')
const multer = require('multer');
const mongoose = require('mongoose');   

database.db();
const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./uploads')
  },
  filename:function(req,file,cb){
    cb(null,new Date().toISOString() +file.originalname)   
  }
})

const upload = multer({storage:storage});
const { check, validationResult } = require("express-validator");
const {students,chats,officers,clients,developers} = require('./rooms/rooms');
   
//connect with atlas
//register new user
router.post('/',upload.single('image'), async (req, res) => {
  const {error} = validate(req.body);
  
  if(error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({email:req.body.email})
  if(user){
   return(
     res.status(400).send('User already exist')
   )
  }

  //save user on the database
  user = new User({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password
  });
 //set hash password
  const salt=await bcrypt.genSalt(10);
  user.password=await bcrypt.hash(user.password,salt);
 //user =new user()
  await user.save();
  const payload={
    user:{
      id:user.id
    }
  }
  // jwt.sign(payload,"jwtToken"),
  // {expiresIn:360000},
  // (err,token)=>{
  //   if(err) throw err;
  //   res.json({token})
  // }

  //set token
  const token = jwt.sign({payload},"jwtPrivateKey",{expiresIn:'24h'})
  console.log(token)
  //res.send(_.pick(user,['_id','name','email']))
  res.send(token)
  //same as above(send details to the client)

  // res.send({
  //   name:user.name,
  //   email:user.email
  // })
  }
);

router.post('/',(req, res) => {
  //const { errors } = validateUser(req.body);
  const  error = validationResult(req);
  if (!error.isEmpty()) {
    console.log("empty")
    return res.status(400).json({ errors: error.array() });
  }
  //const {error} = validate(req.body);
  // Check Validation
  //if(error) return res.status(400).json(error.details[0].message);

  console.log(req.body)
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  const user = new User({
      name:name,
      email:email,
      password:password
  }) 
  user.save();
         
    // User Matched
    const payload = { id: user.id, name: user.name }; // Create JWT Payload
    // Sign Token
    const token = jwt.sign(
      payload,
      process.env.secretKey,
      { expiresIn: 3600 }
    );
    console.log(token)
    res.send(token)
     
  });


router.post('/login',
[
  check("email", "Please include a valid email").isEmail(),
  check("password","password is required").exists()
],
(req, res) => {
  console.log(req.body);
  //const { errors } = validateUser(req.body);
  const  error = validationResult(req);
  if (!error.isEmpty()) {
    console.log("empty")
    return res.status(400).json({ errors: error.array() });
  }
  //const {error} = validate(req.body);
  // Check Validation
  //if(error) return res.status(400).json(error.details[0].message);

  console.log(req.body)
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user  
    if (!user) {
      console.log("userot found")
      error.email = 'User not found';
      return res.status(404).json(error);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {    
        // User Matched
        const payload = { id: user.id, name: user.name }; // Create JWT Payload
        // Sign Token
        const token=jwt.sign(
          payload,
          "jwtPrivateKey",
          { expiresIn: 3600 }
        );
        console.log(token)
        res.send(token)
        // (err, token) => {
        //   res.json({
        //     success: true,
        //     token: 'Bearer ' + token
        //   });
        // }
      } else {
        error.password = 'Password incorrect';
        return res.status(400).json(error);
      }
    });
  });
});//

router.get('/roomData',(req,res) => {
  console.log(req.body);
  const room = req.body;     
  if(room =="Students"){
    students.find((err,data)=>{
      console.log(data)
      res.send({data:data})  
    })
  }
  else if(room =="Officers"){
    officers.find((err,data) =>{
      res.send({data:data})  
    })
  }
  else if(room =="Clients"){      
    clients.find((err,data) =>{
      res.send({data:data})  
    })
  }
  else if(room =="Developers"){
    developers.find((err,data) =>{
      res.send({data:data})  
    })
  }
  else if(room =="Private"){
    User.find((err,data) =>{
      console.log(data);   
      res.send({data:data})  
    })
  }
  else {
    chats.find((err,data) =>{
      console.log(data)
      res.send({data:data})  
    })
  }
 
})

module.exports = router;

