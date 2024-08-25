const sequelize = require('../config/db');
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


exports.login = async (req,res) => {

    const { email, password } = req.body

    if(!email || !password){
        res.status(400).json({
            message: "Email and password are required"
        })
    }

    try{

        const validateEmail = await User.findOne({
            where: {email: email}
        })
    
        if(!validateEmail){
            res.status(401).json({
                message: "Invalid email or password"
            })
        }
    
        const validatePassword = await bcrypt.compare(password, validateEmail.password);

        if(!validatePassword){
            res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = await jwt.sign({ id: validateEmail.id}, "jojo", { expiresIn: '4h' });
        res.status(200).json({
            message: "login success",
            token
        })

    }catch(error){
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
    
}

exports.register = async (req,res) => {

    const {email,password,name} = req.body

    if(!email || !password || !name){
        res.status(400).json({
            message: "invalid method"
        })
    }

    const existingUser = await User.findOne({
        where: { email: email }
    });

    if (existingUser) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }
    
    try{
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds)
    
        const userData = await User.create({
            email: email,
            password: hashPassword,
            name: name
        });
    
        if(userData){
            res.status(200).json({
                message: "store data success!"
            })
        }
    }catch(error){
        res.status(500).json({
            message: 'Error store data: ' + error.message
        });
    }


}