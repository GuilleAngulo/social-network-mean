'use strict';
var app = require('./app');
var port = 3800;


var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/red_social_app', {
    useNewUrlParser: true,
    useCreateIndex: true
    }).then(() => {
        console.log("Database connected successfully");
    
        app.listen(port, () => {
           console.log("Server running at http://localhost:3800"); 
        });


    })
.catch(err => console.log(err));
