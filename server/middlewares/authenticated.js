//MIDDLEWARE AUTHETICATION
'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');

var Global = require('../global');
var secret = Global.secret;

//Next represents the following part that will execute after the middleware
exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
       return res.status(403).send({message: 'The request doesn´t have authentication header'});
    }
    //Delete any '' | "" in the header
    var token = req.headers.authorization.replace(/['"]+/g, '');
        
    
    try{
        var payload = jwt.decode(token, secret);
        
        //If the expiration date on the payload is "smaller" than the actual moment
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
               message: 'The token has expired' 
            });
        }
        
    }catch(ex){
        return res.status(404).send({
               message: 'The token is not valid' 
            });
    }   
    
        req.user = payload;
        
        next();
}