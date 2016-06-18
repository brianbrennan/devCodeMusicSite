//USER MODEL

var mongoose 	= require('mongoose'),
	Schema		= mongoose.Schema,
	bcrypt 		= require('bcrypt-nodejs');

//------------------Setting up the User Schema

var UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	password: {
		type: String,
		required: true,
		select:false
	},
	email: {
		type: String,
		required: true,
		select:false,
		index: {
			unique: true
		}
	},
	comments: {
		type: Array
	},
	admin: {
		type: Boolean,
		select: false,
		default: false
	},
	signUpDate: {
		type:Date,
		select: true,
		default: Date.now()
	},
	avatar: {
		type: String,
		select:true
	}
});


//--------------Hashing Passwords

UserSchema.pre('save',function(next){
	var user = this;

	//hashing only if password has changed
	if(!user.isModified('password'))
		return next();

	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err)
			return next(err);

		user.password = hash;
		next();
	});
});

//-------------User Schema Methods


//Compare password to check if matches user
UserSchema.methods.comparePassword = function(password){
	var user = this;

	console.log(typeof password, typeof user.password);

	return bcrypt.compareSync(password, user.password);
};

//export the User MODEL
module.exports = mongoose.model('User', UserSchema);