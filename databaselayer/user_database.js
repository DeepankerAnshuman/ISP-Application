var mongoClient = require('mongodb').MongoClient;
var connectionString = "mongodb://ispappuser:isp_app_user@ds141434.mlab.com:41434/ispapp";


exports.AddUser = function(user, callback){
    mongoClient.connect(connectionString, function(err, db){
        var collection= db.collection('ispappusers');
        try{
            collection.insertOne(user, function(err, result){
                db.close();
                callback(err, result);
            });
        }catch(e){
            console.log(e);
        }
    });
}