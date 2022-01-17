const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

let TransactionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: {
    type: String,
    required: false
  },
  coinAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MyCoin',
    required: true
  },
  transactionType: {
    type: String,
    default: 'deposit',
    enum: ['deposit', 'withdrawal']
  },
  amount: {
    type: Number,
    required: true
  },
  transactionCharge: {
    type: Number
  },
  transactionStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'processing', 'completed', 'rejected']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

TransactionSchema.plugin(mongosePaginate);
module.exports = mongoose.model('Transaction', TransactionSchema);
