const Joi = require('joi');
const mongoose = require('mongoose');
const {userSchema} = require('./user');


const walletSchema =  new mongoose.Schema({
  accountNumber: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 10
    },
  user: { 
    type: userSchema,  
    required: true
  },
  accountType: { 
    type: String, 
    required: true,
    min: 5,
    max: 255
  },
  accountBalance: {
    type: Number,
    required: true,
    minlength: 0,
    maxlength: 24
  }
});

const Wallet = mongoose.model('Wallet', walletSchema);

function validateWallet(Wallet) {
  const schema = Joi.object({
    accountNumber: Joi.number().integer().min(10**9).max(10**10 - 1),
    userId: Joi.objectId().required(),
    accountType: Joi.string().min(5).max(255).required(),
    accountBalance: Joi.number().integer().min(0).max(1000000000000)
  });

  return schema.validate(Wallet);
}

exports.walletSchema = walletSchema;
exports.Wallet = Wallet; 
exports.validate = validateWallet;