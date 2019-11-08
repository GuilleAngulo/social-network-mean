'use strict';

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var Use = require('../models/user');
var Follow = require('../models/follow');

function testing(req, res){
    res.status(200).send({message: 'Hello World from Publication Controller'});
}

function savePublication (req, res){
    var params = req.body;
    
    //Check if there is a text in the request
    if(!params.text) return res.status(200).send({message: 'You need to send a text into a publication'});
    
    var publication = new Publication();
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();
    
    publication.save((err, publicationStored) => {
        if (err) res.status(500).send({message: 'Error saving the publication'});
        
        if(!publicationStored) res.status(404).send({message: 'Publication not stored'});
        
        res.status(200).send({publication: publicationStored});
    }); 
}


function getPublications(req, res){
    //Get the request parameter of page. If is not passed, will by 1 by default
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    
    var itemsPerPage = 4;
    
    //Populate with user objects the "followed" property,(of the actual user)
    Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
        if (err) res.status(500).send({message: 'Error returning the follow'});
        
        //Array with the followed people objects
        var follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        
        //Add current user publications to the publications array
        follows_clean.push(req.user.sub);
        
        //"$in" operator searches coincidences inside an array. Will search only publications of users inside the array
        //Will be sort as more recent first
        //Paginate results
        Publication.find({user: {"$in": follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) return res.status(500).send({message: 'Error returning the publications'});
            
            if(!publications) return res.status(404).send({message: 'No publications available'});
            
            return res.status(200).send({
                total_items: total,
                pages : Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications 
            });
        });
        
    });
}


function getPublicationsUser(req, res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    
    var user = req.user.sub;
    if(req.params.user){
        user = req.params.user;
    }
    
    var itemsPerPage = 4;

    
    Publication.find({user: user}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
        if (err) return res.status(500).send({message: 'Error returning the publications'});

        if(!publications) return res.status(404).send({message: 'No publications available'});

        return res.status(200).send({
            total_items: total,
            pages : Math.ceil(total/itemsPerPage),
            page: page,
            items_per_page: itemsPerPage,
            publications 
        });
    });
}



function getPublication(req, res){
    var publicationId = req.params.id;
    
    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({message: 'Error returning the publications'});
        
        if(!publication) return res.status(404).send({message: 'The publication doesn´t exist'});
        
        return res.status(200).send({publication});
    });
    
    
}


function deletePublication(req, res){
    var publicationId = req.params.id;
    
    //Inside the find we need to ensure that the current user is the creator of the publication
    Publication.find({'user': req.user.sub, '_id': publicationId}).remove(err => {
        if (err) return res.status(500).send({message: 'Error deleting the publications'});
        
        //if(!publicationRemoved) return res.status(404).send({message: 'The publication is not deleted'});
        
        return res.status(200).send({message: 'Publication successfully deleted'});
    });
}


//Upload user image files
function uploadImage(req, res){
    var publicationId = req.params.id;
    //If there is some file in the request
    if(req.files){
        var file_path = req.files.image.path;
        //Get rid of the "\" character
        var file_split = file_path.split('\\');
        
        //The name of the file is at the third position of the array split
        var file_name = file_split[2];
        
        //Check if the file correspond to an image
        var ext_split = file_name.split('\.');
        //The second position of the split array
        var file_ext = ext_split[1];
        
         console.log(file_name);
        
        //Check if the extension belongs to an image
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' || file_ext == 'JPG'){
                   
          //Check if the publication corresponds to the current user
            Publication.findOne({'user': req.user.sub, '_id': publicationId}).exec((err, publication) => {
               //If the publication that belongs to the currend user exist
                if(publication){
                    //Update publication document
                     Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdated) => {
                    
                    if(err) return res.status(500).send({message: 'Request error'});
        
                    if(!publicationUpdated) return res.status(404).send({message: 'Can´t update the publication'});
                         

                    return res.status(200).send({publication: publicationUpdated})
                    });
                //If is not users publication, remove the files
                } else {
                    return removeFilesOfUploads(res, file_path, 'You don´t have permission to update the publication');
                }
            });
                    
        }else{
           return removeFilesOfUploads(res, file_path, 'Invalid file extension');
        } 
        
    }else{
        return res.status(200).send({message: 'Image not uploaded'});
    }
}


function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
              return res.status(200).send({message: message}); 
           });
}

function getImageFile(req, res){
    
    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/'+image_file;
    
    console.log(path_file);
    
    fs.exists(path_file, (exists) => {
       if(exists){
           console.log(path.resolve(path_file));
           res.sendFile(path.resolve(path_file));
       }else{
           res.status(200).send({message: 'The image doesn´t exist'});
       }
    });
    
}

module.exports = {
    testing,
    savePublication,
    getPublications,
    getPublicationsUser,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}