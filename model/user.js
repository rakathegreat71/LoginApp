var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var userSchema = mongoose.Schema({
	username:{
		type: String,
		index: true
	},

	password:{
		type: String
	},

	email:{
		type: String
	},

	name:{
		type: String
	}
});

var User = module.exports = mongoose.model("fdslsfjd", userSchema);

module.exports.createUser = function (newUser, cb) {
	var bcrypt = require('bcryptjs');
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(cb);
    });
	});
	// body...
}