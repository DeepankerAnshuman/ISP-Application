var express = require('express');
var router = express.Router();
var reviewController = require('../controllers/review_controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyISP' });
});

router.post('/createReview', function(req, res, next){
  reviewController.createReview(req.body.data, function(err){
    if(err) console.log(err);
    else{
      console.log('review has been created successfully..');
      res.writeHead(200, {'content-type': 'text/json' });
      res.write( JSON.stringify(err));
      res.end();
    }
    
  });
});

module.exports = router;
