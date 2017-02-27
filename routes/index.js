var express = require('express');
var router = express.Router();
var Twitter = require('twitter-node-client').Twitter;
var twitter = new Twitter({
        "consumerKey": "V3ztzquJP1seO0mxwBQhgkhpX",
        "consumerSecret": "R8ldfnhbVi7AbOSbRgQEyGnPQPf0zjWBTbksabXwzghBGkNbv2",
        "accessToken": "2220426890-kqtJvKfuXX8S1vpYL6oHsFv71uCiJbEi7Y1rij3",
        "accessTokenSecret": "ln2sDXGQaig1oRs9NrWF0brtN1HlUOHHFFxrlclSCivem",
        "callBackUrl": "XXX"
    });

//Callback functions
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};
var success = function (data) {
    console.log('Data [%s]', data);
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/getTweets', function(req, res, next) {
  twitter.getSearch({'q': req.body.query, 'count': 15}, function(error){
      console.log(error);
  }, function(data) {
      res.send(data);
  });
});

router.post('/submitSetup', function(req, res, next) {
  var params = reg.body;
    
    params.forEach(function(item) {
        
    });
});

module.exports = router;
