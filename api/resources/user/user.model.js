const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongosePaginate = require('mongoose-paginate');

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phonenumber: {
    type: String,
    required: true
  },
  ssn: {
    type: String
  },
  photo: {
    type: String,
    default: null
  },
  idCard: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
  level: {
    type: String,
    default: 'user',
    enum: ['user', 'agent', 'admin']
  }
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ _id: this.id }, process.env.JWT_ACC_ACTIVATE, {
    expiresIn: '30d'
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 60 * 1000;

  return resetToken;
};

UserSchema.plugin(mongosePaginate);
module.exports = mongoose.model('User', UserSchema);
