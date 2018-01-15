var express = require('express');
var router = express.Router();
var User = require('../model/user')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

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
})


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function (err, user) {
   	if (err) {
   		throw err
   	}
   	if (!user) {
   		return done(null, false, {message: "unknown user"})
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		}
   		else{
   			return done(null, false, {message: 'invalid password'})
   		}
   	})
   })
  }
));

router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', "you are logged out");
	res.redirect('/users/login');
})

router.post('/login', passport.authenticate('local', { successRedirect: '/',
	failureRedirect: '/users/login', failureFlash:true }),
function (req, res) {
	console.log('working')
	res.redirect('/');
});
                                                    
module.exports = router;