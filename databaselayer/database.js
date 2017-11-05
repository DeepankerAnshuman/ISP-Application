var mongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var connectionString = "mongodb://ispappuser:isp_app_user@ds141434.mlab.com:41434/ispapp";

mongoose.connect(connectionString);


mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + connectionString);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

var reMatch = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//review schema
var reviewSchema = new mongoose.Schema({
  Author:{type: String, required: true},
  ServiceProvider: {type: String, required: true},
  City: {type: String, required: true},
  Area: {type: String, required: true},
  Rating: {type: Number, min: 1, max: 5},
  IsRecommended: Boolean,
  IsCurrent: Boolean,
  AvgUploadSpeed: {type: Number, min: 0},
  AvgDownloadSpeed: {type: Number, min: 0},
  Email: {type: String, required: true, match: reMatch},
  CreatedAt:{type: Date,default: Date.now},
  Description:{type: String, required: true},
  Comments:[{body: String, commented_by: String,date:Date}],
});

//review model
exports.Review = mongoose.model('Review', reviewSchema,'reviews');


exports.AddUser = function(user, callback){
    mongoClient.connect(connectionString, function(err, db){
        var collection= db.collection('ispappusers');
        try{
            collection.insertOne(user, function(err, result){                
                callback(err, result);
            });
        }catch(e){
            console.log(e);
        }finally{
            db.close();
        }
    });
}