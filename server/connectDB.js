var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/projetdevB3', function(err) {
  if (err) { throw err; }
  else{
      console.log("database Connected");
  }
});