var express = require('express');
var router = express.Router();
var User = require('../model/user')

router.get('/login', (req, res) =>{
	res.render('login')
});

router.get('/register', (req, res) =>{
	res.render('registration')
});

router.post('/register', (req, res) =>{
	var name = req.body.name
	var username = req.body.username
	var email = req.body.email
	var password = req.body.password
	var confirm_password = req.body.confirm_password;

		// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('confirm_password', 'Passwords do not match').equals(req.body.password);

	// 
	var errors = req.validationErrors()


	if (errors) {
		res.render('registration',{
			'errors': errors
		})
		console.log('yes')
	} else {
		var newUser = User({
			name:name,
			email:email,
			username:username,
			password: password
		})
		User.createUser(newUser,function (err, user) {
			if(err) {
				console.log("database error:" + err);
			}
			console.log(user)
		});

		req.flash('success_msg', 'you are registered and now you can login');
		res.redirect('/users/login');
	}




	// console.log(req.body);
	// res.send('done');
})
module.exports = router;