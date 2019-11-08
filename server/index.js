'use strict';

//INDEX.JS => CONNECTION + SERVER CREATION

//Import Express Module configurated in app.js
//FUNCIONANDO
var app = require('./app');

//Port
var port = 3800;


//----------DATABASE CONNECTION-------------
//Import mongoose module
var mongoose = require('mongoose');
//Promises to connect to the DB
mongoose.Promise = global.Promise;
//Connection URL
//mongoose.connect('mongodb://localhost:27017/red_social_app', { useMongoClient: true})
mongoose.connect('mongodb://localhost:27017/red_social_app', {
    useNewUrlParser: true,
    useCreateIndex: true
    }).then(() => {
        console.log("Database connected successfully");
    
        //Create the server | FUNCIONANDO
        app.listen(port, () => {
           console.log("Server running at http://localhost:3800"); 
        });


    })
.catch(err => console.log(err));
