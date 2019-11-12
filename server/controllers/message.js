'use strict';

//Modules
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

//Entities
var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function testing(req, res){
    res.status(200).send({message: 'Hello World from Message Controller'});
}

function saveMessage(req, res){
    var params = req.body;
    
    //Check if the text and the receiver are sent inside the parameters
    if(!params.text || !params.receiver) return res.status(200).send({message: 'Required data of the message is missing'});
    
    
    //Create the new message and fill the properties
    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = false;
    
    //Save the message
    message.save((err, messageStored) => {
       if(err) return res.status(500).send({message: 'Request error (Message)'}); 
       if(!messageStored) return res.status(200).send({message: 'Error sending the message'}); 
        
        return res.status(200).send({message: messageStored});
    });
}

function getReceivedMessages(req, res){
    var userId = req.user.sub;
    
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    
    var itemsPerPage = 4;
    
    //In Mongoose populate() function, is possible to add a second parameter selecting the fields of the object to be sent
    Message.find({receiver: userId}).populate('emitter', '_id name surname nick image').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({message: 'Request error (Message)'}); 
        if(!messages) return res.status(404).send({message: 'No messages available'}); 
        
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages: messages
        })
    });
}

function getEmitMessages(req, res){
    var userId = req.user.sub;
    
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    
    var itemsPerPage = 4;
    
    //In Mongoose populate() function, is possible to add a second parameter selecting the fields of the object to be sent
    Message.find({emitter: userId}).populate('emitter receiver', '_id name surname nick image').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({message: 'Request error (Message)'}); 
        if(!messages) return res.status(404).send({message: 'No messages available'}); 
        
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages: messages
        })
    });
}


function getUnviewedMessages(req, res){
    var userId = req.user.sub;
    
    Message.count({receiver: userId, viewed: false}).exec((err, count) => {
        if(err) return res.status(200).send({message: 'Request error (Message)'}); 
        
        return res.status(200).send({
            unviewed: count
        })
    });
}


function setViewedMessages(req, res){
    var userId = req.user.sub;
    
    Message.update({receiver: userId, viewed: false}, {viewed: true}, {"multi":true}, (err, messagesUpdated) => {
        if(err) return res.status(200).send({message: 'Request error (Setting Message)'}); 

        return res.status(200).send({
            messages: messagesUpdated
        });
    });
}


module.exports = {
    testing,
    saveMessage,
    getReceivedMessages,
    getEmitMessages,
    getUnviewedMessages,
    setViewedMessages
}