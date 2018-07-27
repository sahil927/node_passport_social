var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express', user: req.user });
});

router.get('/login', function(req, res) {
	res.render('login', { title: 'Please Sign In with:' });
});

module.exports = router;
