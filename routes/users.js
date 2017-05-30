var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/auth', function(req, res, next) {
  console.log(req.body);
  res.send("bla");

});

router.get('/test', function(req, res, nxt) {
  console.log(req.query.testKey); // for the form of /users/:id use req.params.id to fetch value
  res.send("balabala");
});

module.exports = router;
