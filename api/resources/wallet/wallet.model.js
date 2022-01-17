const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

let WalletSchema = new mongoose.Schema({
  coin: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Coin',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    default: 0.0
  },
  profit: {
    type: Number,
    default: 0.0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

WalletSchema.plugin(mongosePaginate);
module.exports = mongoose.model('Wallet', WalletSchema);
