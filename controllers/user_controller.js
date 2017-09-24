var db = require('../databaselayer/user_database.js');

var user = {
    firstname:"",
    lastname: "",
    email: "",
    password: ""
}

exports.AddUser = function(data, callback){
    
    db.AddUser(data, function(err, result){
        callback(err, result);
    });
}