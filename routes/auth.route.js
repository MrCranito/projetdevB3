var mongoose = require('mongoose');
    express = require('express');
    connector = require('./../collectionDriver');
    bcrypt = require('bcrypt');
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

    return router;

}