var mongoose = require('mongoose');
var mapper = require('automapper-ts').automapper;
var db = require('../databaselayer/database.js');

exports.createReview = function(data, callback){
    var reviewModel = new db.Review();
    var review =  JSON.parse(data);

    console.log(review);

    reviewModel.Author = 'Anonymous';
    reviewModel.ServiceProvider = review.ServiceProvider;
    reviewModel.City = review.City;
    reviewModel.Area = review.Area;
    reviewModel.Rating = review.Rating;
    reviewModel.IsRecommended = review.IsRecommended;
    reviewModel.IsCurrent = review.IsCurrent;
    reviewModel.AvgUploadSpeed = review.AvgUploadSpeed;
    reviewModel.AvgDownloadSpeed = review.AvgDownloadSpeed;
    reviewModel.Email = review.Email;
    reviewModel.Description = review.Description;

    reviewModel.save(function(err){
        if(err) console.log(err);

        callback(err);
    })
    
    //review.author = data.Author;
}