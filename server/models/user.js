'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String,
    passwordResetToken: {
        type: String,
        select: false,
    }, 
    passwordResetExpires: {
        type: Date,
        select: false,
    }
});

/*
var UserSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    nick: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    name: {
        type: String,
    },
    image: {
        type: String,
    },  
}, {
    timestamps: true,
});*/


module.exports = mongoose.model('User', UserSchema);