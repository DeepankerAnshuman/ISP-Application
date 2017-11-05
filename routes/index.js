var express = require('express');
var router = express.Router();
var reviewController = require('../controllers/review_controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyISP' });
});

router.get('/getReviews', function(req, res, next){
  reviewController.getReviews(function(result, err){
    if(err) console.log(err);
    else{
      res.writeHead(200, {'content-type': 'text/json' });
      res.write( JSON.stringify(result));
      res.end();
    }
  })
});

router.post('/createReview', function(req, res, next){
  reviewController.createReview(req.body.data, function(err){
    if(err)
      res.status(500).send(err.message)
    else{
      console.log('review has been created successfully..');
      res.writeHead(200, {'content-type': 'text/json' });
      res.write( JSON.stringify(err));
      res.end();
    }
    
  });
});

module.exports = router;
