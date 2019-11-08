'use strict';

//JSON WEB TOKENS

var jwt = require('jwt-simple');
var moment = require('moment');
//Secret string, only now by programmer
var Global = require('../global');
var secret = Global.secret;

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };
    
    //It encodes the token with the data on payload and the secret key
    return jwt.encode(payload, secret);
    
};