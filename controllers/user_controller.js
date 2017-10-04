var db = require('../databaselayer/database.js');

exports.AddUser = function(data, callback){
    
    db.AddUser(data, function(err, result){
        callback(err, result);
    });
}