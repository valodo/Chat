var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var RoomSchema = new Schema({
    number: Number,
    name: String
    
});

var Room = mongoose.model('Room', RoomSchema);

module.exports = Room;