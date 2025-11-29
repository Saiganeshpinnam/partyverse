
require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const auth=require('./routes/auth');
const user=require('./routes/user');

const app=express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081', 'https://partyverse-murex.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

app.use('/api/auth',auth);
app.use('/api/user',user);

const MONGO=process.env.MONGO_URI || "mongodb://127.0.0.1:27017/partyverse";
const PORT = process.env.PORT || 5002;
console.log("Connecting to:",MONGO);

mongoose.connect(MONGO).then(()=>{
 console.log("MongoDB Connected");
 app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
}).catch(e=>console.error(e));
