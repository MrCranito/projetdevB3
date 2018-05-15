var mongooseConnect = require('mongoose');

mongooseConnect.connect('mongodb://localhost/projetdevB3', function(err) {
    if (err) { 
                throw err; 
                mongooseConnect.connection.close();
              }
    else{ 
          console.log("Database connected !!");
        };
  });
  
  var connection = mongooseConnect.connection;
  
  connection.on('error', console.error.bind(console, 'connection error:'));
  
  
  connection.once('open', function () {
  
      connection.db.collection("spotbar", function(err, collection){
          collection.find({}).toArray(function(err, data){
              console.log(data); // it will print your collection data
          });
      });
  
      
  });
