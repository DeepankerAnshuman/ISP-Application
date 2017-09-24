var express = require('express');
var router = express.Router();
var userController = require('../controllers/user_controller.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/AddUser', function(req, res, next){
  console.log(req.body);
  userController.AddUser(req.body, function(err, result){
    res.writeHead(200, {'content-type': 'text/json' });
    res.write( JSON.stringify(result));
    res.end();
  });
});

module.exports = router;
