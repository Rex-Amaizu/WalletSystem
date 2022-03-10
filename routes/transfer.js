const auth = require('../middleware/auth');
const Joi = require('Joi');
const {Wallet} = require('../models/wallet');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const senderAct = req.body.senderActNum;
    const receiverAct = req.body.receiverActNum;
    const amt = req.body.amount;
    
    const senderWallet = await Wallet.find({ accountNumber: senderAct });

    const senderActBal = senderWallet[0].accountBalance;
    const senderId = senderWallet[0]._id;

    if (senderActBal < amt) return res.send('Insufficient Funds');

    const newSenderBal = (senderActBal - amt);

    let receiverWallet = await Wallet.find({ accountNumber: receiverAct });

    if (receiverWallet[0] == null) return res.send('Invalid User Account');
        
    const receiverActBal = receiverWallet[0].accountBalance;
    const receiverId = receiverWallet[0]._id;


    const newReceiverBal = (receiverActBal + amt);

    const updateNewSenderBal = await Wallet.findByIdAndUpdate(senderId, { accountBalance: newSenderBal }, {
        new: true
    });

    const updateNewReceiverBal = await Wallet.findByIdAndUpdate(receiverId, { accountBalance: newReceiverBal }, {
        new: true
    });

    return res.send('Transfer successful');

    

});

function validate(req) {
    const schema = Joi.object({
      senderActNum: Joi.number().integer().min(10**9).max(10**10 - 1),
      receiverActNum: Joi.number().integer().min(10**9).max(10**10 - 1),
      amount: Joi.number().integer().min(0).max(1000000000000)
    });
  
    return schema.validate(req);
  }

module.exports = router;