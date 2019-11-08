'use strict';

//var express = require('express');

//Follow Controller Functions
//var ChatController = require('../controllers/chat');

//Express Router
var api = express.Router();


//Middlewares
var md_auth = require('../middlewares/authenticated');


//Routes

//api.get('/chat', md_auth.ensureAuth, ChatController);


module.exports = function(io) {
    //Follow Controller Functions
    var ChatController = require('../controllers/chat')(io);
    app.get('/chat', md_auth.ensureAuth, ChatController);
}