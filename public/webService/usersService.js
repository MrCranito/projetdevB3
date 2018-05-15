var http = require('http');


function UsersService(){

    let createUser = function(user, callback){
        http.post('/users/createUser', user).then((res) => {
            // return the user ref
             if(callback){callback(null, res.data);}
        }, (err) => {
            if(err){
                throw err;
            }
        });
    };
  
}