'use strict';

//The uppercase to remark it is a model
var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');

const crypto = require('crypto');
const mailer = require('../modules/mailer');

//Hashing password module
var bcrypt = require('bcrypt-nodejs');

var mongoosePaginate = require('mongoose-pagination');

var jwt = require('../services/jwt');

//Files management
var fs = require('fs');
var path = require('path');


//TESTS
function testing(req, res){
   res.status(200).send({
      message: 'Test page' 
   }); 
};


//SAVE USER
function saveUser(req, res){
    //Take request parameters
    var params = req.body;
    //New user instance
    var user = new User();
    
    //If all the required atributes are in the request
    if(params.name && params.surname && params.nick && params.email && params.password){
        
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        
        //Duplicate user control (nick or email)
        
        User.find({ $or: [ {email: (user.email).toLowerCase()}, {nick: (user.nick).toLowerCase()} ] }).exec((err, users) => {
                        //If an error occurs
                        if(err) return res.status(500).send({message: 'Error in the request'}); 
                        //If there is one user with same email or nick
                        if(users && users.length >= 1){
                            return res.status(200).send({message: 'The user already exists. Try another nickname or email.'});
                        } else {
                             //The password hash
                             bcrypt.hash(params.password, null, null, (err, hash) => {
                                user.password = hash;

                                //Saving into the database by save mongoose function    
                                user.save((err, userStored) => {

                                    //If saving the user returns some error 
                                    if(err) return res.status(500).send({message: 'Error saving the user'});

                                    //If everything is OK, and user is saved
                                    if(userStored){
                                        res.status(200).send({user: userStored});      
                                    } else {
                                        res.status(404).send({message: 'User not saved'})
                                    }

                                });
                            });
                            
                        }
        });

    //If some required params are missing    
    }else{
        res.status(400).send({
            message: 'The required parameters are not provided'
        });
    }
    
}


//USER LOGIN
function loginUser(req, res){
    var params = req.body;
    
    var email = params.email;
    var password = params.password;
    
    User.findOne({email: email}, (err, user) => {
       if(err) return res.status(500).send({message: 'An error has ocurred'});
        
        if(user){
            //Check if the clear password is the same as the saved hash password
            bcrypt.compare(password, user.password, (err, check) => {
               if(check){
                   
                   
                   if(params.gettoken){
                       //Return Token
                       return res.status(200).send({
                          token: jwt.createToken(user) 
                       });
                       
                   }else{
                       //SECURITY MEASURE: DONT SEND USERS PASSWORDS
                        user.password = undefined;
                        return res.status(200).send({user})
                   }
               } else{
                   //The password is incorrect
                   return res.status(404).send({message: 'The password doesn´t match'});
               }
            });
        } else{
            //The user has not found
            return res.status(404).send({message: 'The user doesn´t exist'});
        }
    });
}

//GET USER INFORMATION BY ID
function getUser(req, res){
    //req.params when parameters come in the URL
    //req.body when parameters come in a PUT or POST method
    var userId = req.params.id;
    
    User.findById(userId, (err, user) => {
       
        //If there is any error searching the user
        if(err) return res.status(500).send({message: 'Request error'});
        
        //If user doesn´t exist in the database
        if(!user) return res.status(404).send({message: 'User doesn´t exists'});
        
        //As the function is a Promise (by await and async) we can use .then()
        followThisUser(req.user.sub, userId).then((value) => {
            //SECURITY MEASURE: DONT SEND USERS PASSWORDS
            user.password = undefined;
            return res.status(200).send({
                user, 
                following: value.following, 
                followed: value.followed
            });
        });
             
    });
}


//async makes this function a Promise, with .then()
async function followThisUser(identity_user_id, user_id){
    
        //To make the function synchronous, it waits until the findOne is done to the save it in the var following
        var following = await Follow.findOne({"user": identity_user_id, "followed": user_id}).exec().then((follow) => {
                return follow;
            }).catch((err) => {
                return handleError(err);
            });
        //To make the function synchronous, it waits until the findOne is done to the save it in the var followed
        var followed = await Follow.findOne({"user": user_id, "followed": identity_user_id}).exec().then((follow) => {
                return follow;
        }).catch((err) => {
                return handleError(err);
        });     
    
    return {
        following: following,
        followed: followed
    }
}


//LIST OF USERS PAGINATED
function getUsers(req, res){
    
    //Id from token payload (sub property)
    var identity_user_id = req.user.sub;
    
    //By default, page will have value "1". In case the page parameter of the request comes with another value it will be changed
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    
    //Number of users displayed per page
    var itemsPerPage = 5;
    
    //List all users sort by id, and paginate them according to actual page and maximum number of users per page
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if(err) return res.status(500).send({message: 'Request error'});
        
        if(!users) return res.status(404).send({message: 'No users available'});
        
        //SECURITY MEASURE: DONT SEND USERS PASSWORDS
        users.forEach((user) => {
           user.password = undefined;  
        });
        
        followUserIds(identity_user_id).then((value) => {
           
            return res.status(200).send({
               //NodeJS interpret users: users as users
               users,
               users_following: value.following,
               users_follow_me: value.followed,
               total,
               pages: Math.ceil(total/itemsPerPage)
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

//Edit user data
function updateUser(req, res){
    
    //Request User ID
    var userId = req.params.id;
    //Request Body
    var update = req.body;
    
    //It is recommended to edit password in a separate function. The password is deleted at this function
    delete update.password;
    
    //The user id received by URL has to be the same as the user id on the token
    if(userId != req.user.sub){
        return res.status(500).send({message: 'You don´t have permission to update user data '});
    }
    
    User.find({ $or: [ {email: update.email}, {nick: update.nick} ] }).exec((err, users) => {
        
        var user_isset = false;
        
        users.forEach((user) => {
            if(user && user._id != userId) user_isset = true;
        });
        
        if(user_isset) return res.status(200).send({message: 'Data already in use.'});
        
       //If the 3 parameter of the mongoose method is "new:true" then the userUpdated will be the updated object. If is not assigned, the updated user will be the previous version of the object
        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
            if(err) return res.status(500).send({message: 'Request error'});

            if(!userUpdated) return res.status(404).send({message: 'Can´t update the user'});
            
            //SECURITY MEASURE: DONT SEND USERS PASSWORDS
            userUpdated.password = undefined;

            return res.status(200).send({user: userUpdated});
        });  
    }); 
}


//Upload user image files
function uploadImage(req, res){
    var userId = req.params.id;
    
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
        
        //Check if the user who is uploading is the same as logged
        if(userId != req.user.sub){
            console.log(userId + " | " + req.user.sub);
            return removeFilesOfUploads(res, file_path, 'You don´t have permission to update user data');
        }
        
        
        //Check if the extension belongs to an image
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
           User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated) => {
               if(err) return res.status(500).send({message: 'Request error'});
        
                if(!userUpdated) return res.status(404).send({message: 'Can´t update the user'});
               
               //SECURITY MEASURE: DONT SEND USERS PASSWORDS
                userUpdated.password = undefined;

                return res.status(200).send({user: userUpdated})
                });
            
        }else{
           return removeFilesOfUploads(res, file_path, 'Invalid file extension');
        } 
        
    }else{
        return res.status(200).send({message: 'Image not uploaded'});
    }
}


function getImageFile(req, res){
    
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/'+image_file;
        
    fs.exists(path_file, (exists) => {
       if(exists){
           res.sendFile(path.resolve(path_file));
       }else{
           res.status(200).send({message: 'The image doesn´t exist'});
       }
    });
    
}


function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
              return res.status(200).send({message: message}); 
           });
}



function getCounters(req, res){
    var userId = req.user.sub;
    
    if(req.params.id){
        userId = req.params.id;
    } 
    
    getCountFollow(userId).then((value) => {
          return res.status(200).send(value); 
       });
}

//Get Count of people Following and Followed
async function getCountFollow(user_id){
    
    //Count the quantity of people following
    var following = await Follow.count({"user": user_id}).exec().then((count) => {
        return count;
    }).catch((err) => {
        return handleError(err);    
    });
    
    //Count the quantity of people following
    var followed = await Follow.count({"followed": user_id}).exec().then((count) => {
        return count;
    }).catch((err) => {
        return handleError(err);    
    });
    
    //Count the quantity of people following
    var publications = await Publication.count({"user": user_id}).exec().then((count) => {
        return count;
    }).catch((err) => {
        return handleError(err);    
    });
    
    return {
        following: following,
        followed: followed,
        publications: publications
    }
    
}

async function forgotPassword(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user)
                return res.status(400).send({ error: 'User not found.'});


            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate(user.id, 
                {
                    '$set': {
                        passwordResetToken: token,
                        passwordResetExpires: now,
                } 
            }, { useFindAndModify: false });

            mailer.sendMail({
                to: email,
                from: 'anyermo@gmail.com',
                template: 'auth/forgot_password',
                context: { token },

            }, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ error: 'Cannot send forgotten password email' });
                }
        
                console.log(`Password recovery email sent to user with email: ${email}.`);
                return res.status(200).send({ message: 'Password recovery email sent successfully. ' });
            });


        } catch (err) {

            res.status(400).send({ error: 'Error on forgot password, try again.'})
        }
    }

    async function resetPassword(req, res) {
        const { email, token, password } = req.body;

        try {
            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpires');

            if (!user)
                return res.status(400).send({ error: 'User not found.'});

            if (token !== user.passwordResetToken)
                return res.status(400).send({ error: 'Token invalid.' });
            
            const now = new Date();

            if (now > user.passwordResetExpires)
                return res.status(400).send({ error: 'Token expired, generate a new one.' });

            await bcrypt.hash(password, null, null, (err, hash) => {
                user.password = hash;
            });

            await user.save();

            console.log(`Password changed for user with email: ${email}.`);
            res.status(200).send({ message: 'Password changed successfully.' });

        } catch (err) {
            res.status(400).send({ error: 'Cannot reset passsword, try again.' });
        }
    }


//Export the functions defined
module.exports = {
    testing,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters,
    forgotPassword,
    resetPassword
}