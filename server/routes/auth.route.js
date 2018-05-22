var mongoose = require('mongoose');
    express = require('express');
    connector = require('./../collectionDriver');
    bcrypt = require('bcrypt');
    cloudinary = require('cloudinary');
    base64Img = require('base64-img');


    cloudinary.config({ 
        cloud_name: 'kyzer', 
        api_key: '837624926995455', 
        api_secret: 'qpeLY8-2udmtIs5BGQUuUAShuts' 
      });

module.exports.publicRoutes = function () {

    var schemaUser = new mongoose.Schema({ username: 'string', name: 'string' , email: 'string', password:'string',picture:'string'},{ collection : 'Users' });
    var modelUser = mongoose.model('User', schemaUser);

    var router = express.Router();
    
    router.post('/createUser/:username/:name/:email/:password/:picture', (req, resp, next)=>{
        var username = req.params.username;
            name = req.params.name;
            email = req.params.email;
            password = req.params.password;
            picture = req.params.picture;
            saltRounds = 10;
            json ={email : email};
            modelUser.findOne(json, function(err, userChecking){
                if(err){ 
                       throw err;
                }
                else{
                    if(userChecking == null){
                        bcrypt.hash(password, saltRounds, function(err, hash) {
                            var json = {username: username, name: name, email: email, password: hash, picture : picture};
                            modelUser.create(json, function(err, json){
                                if(err){throw err;}
                                else{
                                    resp.json({
                                        status : "User Created !!"
                                    });
                                }
                            });
                        });
                    }
                    else{
                            if(err){
                                throw err;
                            }
                            else{
                                resp.json({
                                    user : userChecking,
                                    status : "User Exist"
                                });
                            }
                    }
                    
                }
        });
    });
    router.post('/checkUser', (req, resp, next )=>{

        //console.log(req);
        var email = req.body.email;
            reqpassword = req.body.password;
            json = {email : email};
        
        modelUser.findOne(json, function(err, userChecking){
            if(err){ 
                   throw err;
            }
            else{
                if(userChecking == null){
                    resp.json({
                        error : "User don't Exists"
                     });
                }
                else{
                    var hash = userChecking.password;
                    bcrypt.compare(reqpassword, hash, function(err, res) {
                        if(err){
                            throw err;
                        }
                        else{
                            resp.json({
                                user : userChecking,
                                status : "User Exist"
                            });
                        }
                      
                    });
                    
                }
                
            }
        });
    });
    router.post('/getUser', (req, resp, next )=>{

        console.log("ok");
        var email = req.body.email;
            json = { email : email };

        console.log(json);

        modelUser.findOne(json, function(err, getUser){
            if(err){ 
                   throw err;
            }
            else{
                if(getUser == null){
                    resp.json({
                        error : "error"
                     });
                }
                else{
                    resp.json({
                        username : getUser.username,
                        name : getUser.name,
                        email : getUser.email,
                        password : getUser.password,
                        picture : getUser.picture
                    });
                }
                
            }
        });
    });


    router.post('/updateUserInfo', (req, resp, next)=>{
        var email = req.body.email;

            usernameUpdated = req.body.username;
            nameUpdated = req.body.name;
            passwordUpdated = req.body.password;

            modelUser.updateOne({email : email},{ $set :{ name : nameUpdated, username : usernameUpdated, password : passwordUpdated}}, function(err, response){
                if(err){
                    throw err;
                }
                else{
                    resp.json({
                        result : response
                    });
                }
            });

    });

    router.post('/addPictureToCloudinary', (req, resp, next)=>{
        var email = req.query.email;
            imgAsBase64 = req.query.picture;
            console.log(imgAsBase64, email);
            base64Img.img(imgAsBase64, './uploads', 'userPic', function(err, filepath) {
                console.log(filepath);
                cloudinary.v2.uploader.upload(filepath, function(error, result) {
                    if(error){
                        console.log(error);
                        }
                    modelUser.updateOne({email : email},{ $set: { picture: result.secure_url, public_id : result.public_id }},function(err, response){
                            if(err){
                                throw err;
                                }
                            else{
                                resp.json({
                                    result : response
                                    });
                                }
                    });
                });            
            });
    });

    router.post('/updatePictureCloudinary', (req, resp, next)=>{
        var email = req.body.email;
            pictureUpdated = req.body.picture;
            base64Img.img('data:image/png;base64,'+imgAsBase64, './uploads', ''+email, function(err, filepath) {
                modelUser.findOne({email :email}, function(err, userExists){
                    if(err){ 
                           throw err;
                    }
                    else{
                        if(userExists == null){
                            resp.json({
                                error : "User don't Exists"
                             });
                        }
                        else{
                            cloudinary.v2.uploader.upload(filepath,{ public_id : userExists.public_id},
                                function(error, result) {
                                    if(error){
                                        console.log(error);
                                    }
                                    signature = result.signature;
                                    console.log(result);
                                    modelUser.updateOne({ _id: userExists._id }, { $set: { picture: result.secure_url }},function(err, response){
                                        if(err){
                                            throw err;
                                        }
                                        else{
                                            resp.json({
                                                result : result
                                            });
                                        }
                                    });
                                });
                            
                        }
                        
                    }
                });
               
            });
    });

    return router;

}