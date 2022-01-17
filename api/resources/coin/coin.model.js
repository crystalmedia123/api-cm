const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

let CoinSchema = new mongoose.Schema({
    name : {
        type : String,
        maxlength: [30, 'Name can not be more than 15 characters'],
        required: true,
        unique: true
    },
    abbr : {
        type : String,
        required : true,
        unique: true,
        maxlength: [10, 'Name can not be more than 5 characters']
    },
    address : {
        type : String,
        required : true,
    },
    icon: {
      type: String,
      default: null,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
});

CoinSchema.plugin(mongosePaginate);
module.exports = mongoose.model("Coin", CoinSchema);