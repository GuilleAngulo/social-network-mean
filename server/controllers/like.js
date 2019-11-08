'use strict';

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Like = require('../models/like');
var Publication = require('../models/publication');


//CREATE A LIKE
function saveLike(req, res){
    var params = req.body;
    var userId = req.user.sub;
    var publicationId = params.publication;
    
    Like.find({ 'user':userId, 'publication':publicationId }, (error, searchedLike) => {

        //If there is any error searching the user
        if(error) return res.status(500).send({message: 'Request error'});
        
        //If like doesn´t exist in the database
        if(!searchedLike.length){
            
            var like = new Like();
            like.user = req.user.sub;
            like.publication = params.publication;
            
            like.save((err, likeStored) => {
                if(err) return res.status(500).send({message: 'Error creating the like'});
        
                if(!likeStored) return res.status(404).send({message: 'The like is not stored'});
        
                return res.status(200).send({like: likeStored});
            });
        }
        else{
            return res.status(200).send({message: 'The Like already exists'});
        }

    });
}


function checkLike(req, res){
    
    var userId = req.user.sub;
    var publicationId = req.params.id;
    
    Like.find({ 'user':userId, 'publication':publicationId }, (error, like) => {
        if(error) return res.status(500).send({message: 'Error searching the like'});
        
        if(!like) return res.status(404).send({message: 'Like not found'});

        return res.status(200).send({like}); 
    });
}


//DELETE LIKE
function deleteLike(req, res){
    
    var userId = req.user.sub;
    var publicationId = req.params.id;
    
    Like.find({'user':userId, 'publication':publicationId}).remove(err => {
       if(err) return res.status(500).send({message: 'Error deleting the like'}); 
        
       return res.status(200).send({message: 'The like is deleted correctly'});
    }); 
}




//GET LIKES 

function getLikes(req, res){
    var publicationId = req.params.publication;
    
    //By default the following users
    var find = Like.find({publication: publicationId});

    find.populate('user').exec((err, likes) => {
         if(err) return res.status(500).send({message: 'Server error'});
        
         if(!likes) return res.status(404).send({message: 'No likes'});
        
        res.status(200).send({likes});
    });
    
}



module.exports = {
    saveLike,
    checkLike,
    deleteLike,
    getLikes
}