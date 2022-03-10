const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const config = require('config');
const {Wallet, validate} = require('../models/wallet'); 
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('Invalid user.');

    const accountType = req.body.accountType;
    const accountBalance = req.body.accountBalance;

    generateAccount(Wallet, user, accountType, accountBalance);

    async function generateAccount(Wallet, user, accountType, accountBalance) {
    
        const randNum = Math.floor(Math.random() * 100000000);
        const prefX = 27;
        const actNum = ("" + prefX + randNum);

        const accountNumber = await Wallet.findOne({ accountNumber: actNum });
        if (accountNumber) {
            generateAccount(Wallet, user, accountType, accountBalance);
        }else {
            const wallet = await new Wallet({ 
                accountNumber: actNum,
                user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                password: user.password
                },
                accountType: accountType,
                accountBalance: accountBalance
            });
            await wallet.save();
            
            res.json({success : "Wallet Created Successfully", 
                accountNumber: wallet.accountNumber, 
                name: wallet.user.name, 
                email: wallet.user.email, 
                userId: wallet.user._id,
                accountType: wallet.accountType,
                accountBalance: wallet.accountBalance,
                _id: wallet._id
            });
    
        }
            

        
    }
  
});


module.exports = router; 