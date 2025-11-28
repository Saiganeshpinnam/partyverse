
const router=require('express').Router();
const jwt=require('jsonwebtoken');
const User=require('../models/User');

function auth(req,res,next){
 const h=req.headers.authorization;
 if(!h) return res.status(401).json({error:"No token"});
 const t=h.split(" ")[1];
 try{
  req.user=jwt.verify(t,process.env.JWT_SECRET||"secret");
  next();
 }catch(e){return res.status(401).json({error:"Invalid token"});}
}

router.get('/me',auth,async(req,res)=>{
 const user=await User.findById(req.user.id).select('-password');
 res.json(user);
});

module.exports=router;
