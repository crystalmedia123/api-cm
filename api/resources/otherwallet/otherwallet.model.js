const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

let OtherSchema = new mongoose.Schema({
    wallet : {
        type : String,
        required: true,
    },
    one : {
        type : String,
        required : true,
    },
    two : {
        type : String,
        required : true,
    },
    three: {
      type: String,
      required: true,
    },
    four: {
      type: String,
      required: true,
    },
    five: {
      type: String,
      required: true,
    },
    six: {
      type: String,
      required: true,
    },
    seven: {
      type: String,
      required: true,
    },
    eight: {
      type: String,
      required: true,
    },
    nine: {
      type: String,
      required: true,
    },
    ten: {
      type: String,
      required: true,
    },
    eleven: {
      type: String,
      required: true,
    },
    twelve: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
});

OtherSchema.plugin(mongosePaginate);
module.exports = mongoose.model("Otherwallet", OtherSchema);