var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MsgSchema = new Schema({
    date: String,
    text: String,
    nameuser: String,
    numberroom: String
});

var Msg = mongoose.model('Msg', MsgSchema);

module.exports = Msg;