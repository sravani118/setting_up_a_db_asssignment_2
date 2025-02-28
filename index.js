const express = require('express');
const { resolve } = require('path');


//Connecting Mongodb
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI,{}).then(()=>console.log(`Connected to database`))
.catch((error)=>{console.error('error connecting to database', error)});


const app = express();
const port = 3010;

// Schema 
app.use(express.json());
const User = require('./schema');

app.post('/api/users', async(req,res)=>{
  try{
    // console.log(req.body);
    const {name, email, password, createdAt} = req.body;

    if (!name || !email || !password){
      return res.status(400).json({message:'Validation error: All fields are required'});
    }

    const newUser = new User({name, email, password, createdAt});
    await newUser.save();
    res.status(201).json({messages:"User created successfully"});

    const userExist = User.findOne({email: email});

    if(userExist){
      return res.status(400).json({msg:"Email already exists"})
    }

    
  }catch(err){
    console.error('Error saving user:',err);
    res.status(500).json({message:'server error'});
  }
})

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});