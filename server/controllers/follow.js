'use strict';

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');


//CREATE A FOLLOW
function saveFollow(req, res){
    var params = req.body;
    
    var follow = new Follow();
    
    //The actual user is saved at req.user after decoding the requesting token
    follow.user = req.user.sub;
    follow.followed = params.followed;
    
    follow.save((err, followStored) => {
       if(err) return res.status(500).send({message: 'Error following'});
        
       if(!followStored) return res.status(404).send({message: 'The follow is not stored'});
        
       return res.status(200).send({follow: followStored});
    });
}

//DELETE FOLLOW
function deleteFollow(req, res){
    
    var userId = req.user.sub;
    var followId = req.params.id;
    
    Follow.find({'user':userId, 'followed':followId}).remove(err => {
       if(err) return res.status(500).send({message: 'Error unfollowing'}); 
        
       return res.status(200).send({message: 'The unfollow is complete'});
    });   
}


//GET LIST OF FOLLOWING
function getFollowingUsers(req, res){
    var userId = req.user.sub;
    //If the User ID comes in the request, it will be prioritary over the token User ID
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }
    
    var page = 1;
    //If the page comes in the request
    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }
    
    
    var itemsPerPage = 4;
    
    //Populate fills the "followed" atribute with the complete user object
    Follow.find({user:userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
         if(err) return res.status(500).send({message: 'Server error'});
        
         if(!follows) return res.status(404).send({message: 'You are not following'});
        
        followUserIds(req.user.sub).then((value) => {
            return res.status(200).send({
               total: total,
               pages: Math.ceil(total/itemsPerPage),
               follows,
               users_following: value.following,
               users_follow_me: value.followed,
            });
        });
    });
}

async function followUserIds(user_id){
    var following = await Follow.find({"user": user_id}).select({'_id':0, '_v':0, 'user':0}).exec().then((follows) => {
        return follows;
        }).catch((err) => {
                return handleError(err);    
        });

    var followed = await Follow.find({"followed": user_id}).select({'_id':0, '_v':0, 'followed':0}).exec().then((follows) => {
        return follows;
        }).catch((err) => {
                return handleError(err);    
        });
    
    
    var following_clean = [];
    
    following.forEach((follow) => {
        following_clean.push(follow.followed);
    });
    
    var followed_clean = [];
    
    followed.forEach((follow) => {
        followed_clean.push(follow.user);
    });

    return{
        following: following_clean,
        followed: followed_clean
    }
    
}



//GET LIST OF FOLLOWED
function getFollowedUsers(req, res){
    var userId = req.user.sub;
    //If the User ID comes in the request, it will be prioritary over the token User ID
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }
    
    var page = 1;
    //If the page comes in the request
    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }
    
    
    var itemsPerPage = 4;
    
    //Populate fills the "followed" atribute with the complete user object
    Follow.find({followed:userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
         if(err) return res.status(500).send({message: 'Server error'});
        
         if(!follows) return res.status(404).send({message: 'You are not followed'});
        
        followUserIds(req.user.sub).then((value) => {
            return res.status(200).send({
               total: total,
               pages: Math.ceil(total/itemsPerPage),
               follows,
               users_following: value.following,
               users_follow_me: value.followed,
            });
        });
    });
}


//GET FOLLOW LIST
function getFollows(req, res){
    var userId = req.user.sub;
    
    //By default the following users
    var find = Follow.find({user: userId});
    
    //If in the request there is the parameter followed, the followed users
    if(req.params.followed){
        find = Follow.find({followed: userId});
    }
    
    
    find.populate('user followed').exec((err, follows) => {
         if(err) return res.status(500).send({message: 'Server error'});
        
         if(!follows) return res.status(404).send({message: 'You are not following'});
        
        res.status(200).send({follows});
    });
    
}



module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getFollows
}