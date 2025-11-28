
const router=require('express').Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

router.post('/register',async(req,res)=>{
 try{
  console.log('Registration request received:', req.body);
  const {name,username,email,password}=req.body;
  if(!name||!username||!email||!password) {
    console.log('Missing fields in registration request');
    return res.status(400).json({error:"Missing fields"});
  }
  
  // Check if email already exists
  const emailExists=await User.findOne({email});
  if(emailExists) {
    console.log('Email already exists:', email);
    return res.status(409).json({error:"Email already exists"});
  }
  
  // Check if username already exists
  const usernameExists=await User.findOne({username});
  if(usernameExists) {
    console.log('Username already exists:', username);
    return res.status(409).json({error:"Username already exists"});
  }
  
  const hash=await bcrypt.hash(password,10);
  
  // Generate username if not provided (for backward compatibility)
  const finalUsername = username || name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).substr(2, 4);
  
  const user=await User.create({name,username:finalUsername,email,password:hash});
  console.log('User created successfully:', user);
  res.status(201).json({message:"Registered", user: {id: user._id, name: user.name, username: user.username, email: user.email}});
 }catch(e){
  console.error('Registration error:', e);
  res.status(500).json({error:"Server error"});
 }
});

router.post('/login',async(req,res)=>{
 try{
  console.log('Login request received:', { email: req.body.email });
  const {email,password}=req.body;
  const user=await User.findOne({email});
  console.log('User found:', user ? { id: user._id, email: user.email, name: user.name } : null);
  if(!user) {
    console.log('User not found:', email);
    return res.status(401).json({error:"Invalid"});
  }
  console.log('Comparing password for user:', email);
  const ok=await bcrypt.compare(password,user.password);
  console.log('Password comparison result:', ok);
  if(!ok) {
    console.log('Invalid password for:', email);
    return res.status(401).json({error:"Invalid"});
  }
  const token=jwt.sign({id:user._id},process.env.JWT_SECRET||"secret",{expiresIn:"7d"});
  console.log('Login successful for:', email);
  res.json({token,user});
 }catch(e){
  console.error('Login error:', e);
  res.status(500).json({error:"Server error"});
 }
});

module.exports=router;
