const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'ItsSaturdayToday'

// Route 1: create a user using :POST "api/auth/createuser". No Loginn required 
router.post('/createuser', 
    [   
        body('name').isLength({min:3}),
        body('email').isEmail(),
        body('password').isLength({min:5}),
    ],
    async (req,res)=>{
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success, errors : errors.array()});
    }
    // check whether the user with same email already exists
    try{
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.statue(400).json({success, error: "Sorry a user with this email already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt)
;        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        // .then(user => res.json(user))
        // .catch(err => {console.log(err)
        // res.json({error: "Please enter a uniqe email", message: err.message})})
        const data = {
            user:{
                id: user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SECRET);
        // console.log(jwtData);
        res.json({success, authToken});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Some errror occured");
    }

})


// Route 2: Authenticate a user using :POST "api/auth/login". No Login required 
router.post('/login', 
    [   
        body('email','Enter a valid Email').isEmail(),
        body('password','Please enter password').exists()
    ],
    async (req,res)=>{
        let success = false;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({success, errors : errors.array()});
        }

        const {email, password} = req.body;
        try {
            let user = await User.findOne({email});
            if(!user){
               return res.status(400).json({success, error: "Sorry, user doesn't exists"})
            }

            const passwordCompare = await bcrypt.compare(password, user.password);

            if(!passwordCompare){
                return res.status(400).json({success, error: "Sorry, password didn't match"})
            }

            const data = {
                user:{
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
        // console.log(jwtData);
        success = true;
        res.json({success, authToken});
            
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server error");
        }
});

// Route 3: Get loggedin user details :POST "api/auth/getuser". N Login required 

router.post('/getuser', fetchuser,
    
    async (req,res)=>{
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select('-password');
            res.send(user);
        } catch (error) {
            console.error(error.message);
                    res.status(500).send("Internal Server error");
        }
    });

module.exports = router;