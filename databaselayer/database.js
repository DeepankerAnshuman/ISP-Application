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

//review schema
var reviewSchema = new mongoose.Schema({
  Author:String,
  ServiceProvider: String,
  City: String,
  Area: String,
  Rating: Number,
  IsRecommended: Boolean,
  IsCurrent: Boolean,
  AvgUploadSpeed: Number,
  AvgDownloadSpeed: Number,
  Email: String,
  CreatedAt:{type:Date,default:Date.now},
  Description:String,
  Comments:[{body:String,commented_by:String,date:Date}],
});

//review model
exports.Review = mongoose.model('Review', reviewSchema,'reviews');


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