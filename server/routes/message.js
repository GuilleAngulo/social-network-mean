'use strict'; 

//Modules
var express = require('express');
var messageController = require('../controllers/message');

//Router initialitation
var api = express.Router();

//Middlewares
var md_auth = require('../middlewares/authenticated');

//Routes
api.get('/test-message-controller', md_auth.ensureAuth, messageController.testing);
api.post('/message', md_auth.ensureAuth, messageController.saveMessage);
api.get('/get-received-messages/:page?', md_auth.ensureAuth, messageController.getReceivedMessages);
api.get('/get-emit-messages/:page?', md_auth.ensureAuth, messageController.getEmitMessages);
api.get('/unviewed-messages', md_auth.ensureAuth, messageController.getUnviewedMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, messageController.setViewedMessages);

//Export
module.exports = api;

