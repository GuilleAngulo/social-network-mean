'use strict';

var express = require('express');

//Like Controller Functions
var LikeController = require('../controllers/like');

//Express Router
var api = express.Router();


//Middlewares
var md_auth = require('../middlewares/authenticated');


//Routes
api.post('/like', md_auth.ensureAuth, LikeController.saveLike);
api.get('/like/:id', md_auth.ensureAuth, LikeController.checkLike);
api.delete('/delete-like/:id', md_auth.ensureAuth, LikeController.deleteLike);
api.get('/get-likes/:publication', md_auth.ensureAuth, LikeController.getLikes);


module.exports = api;