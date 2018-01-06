var express = require("express");
var bodyParser = require("body-parser");
var util = require("util");
var path = require("path");
var mongoose = require("mongoose");
var User = require("./modules/DBUser");
var Room = require("./modules/DBRoom");
var Msg = require("./modules/DBMsg");

var app = express();

app.set("view options", {layout: false});
app.use(express.static(__dirname + "/pages"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
var options = {
    useMongoClient: true,
    user: 'valodo',
    pass: '123Stella'
  };
mongoose.connect('mongodb://valodo:123Stella@ds235827.mlab.com:35827/chatdb', options).then(
    () => { console.log('DB connected successfully!'); },
    err => { console.error(`Error while connecting to DB: ${err.message}`); }
);

var port = process.env.PORT || 8080;

app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

//NEW USER - controllare un nome
app.post('/user', function(req, res){
    //res.statusCode = 200;
    //res.setHeader('Content-Type', 'application/json');
    var name = req.body.name;
    console.log('Received name ' + name);
    var newUser = User({name: name});
    console.log('Trying to save the new user');
    newUser.save(function (err) {
        if (err) {
            console.log('Error while saving user');
            return handleError(err);
        }
        else {
            console.log('User successfully saved!');
            res.send("Nuovo utente:" + newUser.name);
        }
    })
});

//VIEW USER
app.get('/user/:userName', function(req, res){
    var name = req.params.userName;
    console.log("Received " + name);
    User.findOne({ name: name}, function(err, doc){
        console.log("Searching user...");
        console.log(doc);
            if (err){
               console.log("Error while search username");
              return handleError(err);
          } else if (!doc) {
              res.status(404).send("utente non trovato");
          }else{
               res.status(200).send("utente trovato");
              console.log('Find user with ' + name);
              //res.write("Name of user is " + doc.name);
              res.end();
          }
    });
});

//EDIT USER
app.put('/user', function(req,res){
    var name = req.body.name;
    var newName = req.body.newName;
    console.log('Replace ' + name + " in " + newName);
    User.findOne({ name: name }, function (err, doc) 
    {
          if (err){
               console.log("Error while edit name of user");
              return handleError(err);
          } else{
              doc.name = newName;
              doc.save(function(err){
                  if(err){
                      console.log("Error while saving new name");
                      return handleError(err);
                  }else{
                      console.log('New name successfully saved!');
                      res.send("Nuovo nome:" + doc.name);
                  }
              });
          }
    });
});

//NEW ROOM
app.post('/room', function(req, res){
    var number = req.body.number;
    var name = req.body.name;
    console.log("Name " + name + "\nNumero " + number);
    var room = new Room({number: number, name: name});
    room.save(function (err) {
        if (err) {
            console.log('Error while saving user');
            return handleError(err);
        }
        else {
            console.log('Room successfully saved!');
            res.send("Nuova stanza:" + room.name);
        }
    });
});

//EDIT ROOM'S NAME
app.put('/room', function(req, res){
    var number = req.body.number;
    var newName = req.body.newName;
    Room.findOne({ number: number }, function (err, doc) 
    {
      if (err) return handleError(err);
      doc.name = newName;
      doc.save(function(err){
                  if(err){
                      console.log("Error while saving new name");
                      return handleError(err);
                  }else{
                      console.log('New name successfully saved!');
                      res.send("Nuovo nome:" + doc.name);
                  }
              });
    });
});

//SHOW ALL ROOMS
app.get('/rooms', function(req, res){
    Room.find(function (err, rooms) {
        if (err) { res.send(err); }
        console.log(rooms);
        res.json(rooms);
    });
});

//SHOW MESSAGE FOR A ROOM X IN THE TIME X
app.get('/msg', function(req, res){
    var x = parseInt(req.query.room);
    var y = req.query.time.toString();  
    
    Msg.find({ data: y, numberroom: x}, function (err, msgs) 
    {
        console.log("Searching msg...");
        if (err) { res.send(err); }
        console.log(msgs);
        res.json(msgs);
    });
});

//WRITE MESSAGE
app.post('/msg', function(req, res){
    var date = req.body.date;
    var text = req.body.text;
    var nameUser = req.body.nameuser;
    var numberRoom = req.body.numberroom;
    var msg = new Msg({date: date, text: text, nameuser: nameUser, numberroom: numberRoom});
    msg.save(function(err){
                  if(err){
                      console.log("Error while saving new msg");
                      return handleError(err);
                  }else{
                      console.log('New msg successfully saved!');
                  }
              });
});



app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});



app.listen(port);
console.log('Magic happens on port ' + port);


module.exports = app;