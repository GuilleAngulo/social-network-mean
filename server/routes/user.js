'use strict'

var express = require('express');
var UserController = require('../controllers/user');

//This method allows the access to the methods GET, POST, PUT, DELETE
var api = express.Router();

//MIDDLEWARE Authentication
var md_auth = require('../middlewares/authenticated');

//MIDDLEWARE Multiparty
var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './uploads/users'});

//First Parameter: Route
//Second Parameter: Middleware
//Third Parameter: Controller Function
api.get('/test-user-controller', md_auth.ensureAuth, UserController.testing);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
api.get('/counters/:id?',md_auth.ensureAuth, UserController.getCounters);

api.post('/forgot-password', UserController.forgotPassword);
api.post('/reset-password', UserController.resetPassword);

module.exports = api;