const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

let CoinSchema = new mongoose.Schema({
    coin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Coin',
        required : true
    },
    balance : {
        type : Number,
        default : 0.0,
    },
    profit : {
        type : Number,
        default : 0.0,
    },
    order : {
        type : Number,
        default : 0.0,
    },
    owner: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
});

CoinSchema.plugin(mongosePaginate);
module.exports = mongoose.model("MyCoin", CoinSchema);