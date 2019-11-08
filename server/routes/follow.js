'use strict';

var express = require('express');

//Follow Controller Functions
var FollowController = require('../controllers/follow');

//Express Router
var api = express.Router();


//Middlewares
var md_auth = require('../middlewares/authenticated');


//Routes
api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);
api.delete('/unfollow/:id', md_auth.ensureAuth, FollowController.deleteFollow);
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers);
api.get('/get-follows/:followed?', md_auth.ensureAuth, FollowController.getFollows);


module.exports = api;