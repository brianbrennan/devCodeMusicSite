//USER API ROUTING

var User 		= require('../model/user'),
	Comment 	= require('../model/comment'),
	jwt			= require('jsonwebtoken'),
	config		= require('../../server-config'),
	superSecret	= config.superSecret;



module.exports = function(app, express){


	//Get Instance of express router
	var userRouter = express.Router();

	userRouter.route('/')
		.post(function(req, res){
			var user = new User();

			user.username = req.body.username;
			user.password = req.body.password;
			user.email	  = req.body.email;

			user.save(function(err){
				if(err){
					if(err.code == 11000){
						return res.json({
							success: false,
							message: err.errmsg
						});
					}
					else
						return res.send(err);
				}

				res.json({
					message:'User Created!'
				});
			});
		});




	userRouter.post('/authenticate', function(req, res){
		User.findOne({
			username: req.body.username
		}).select('username password').exec(function(err, user){

			//error handling
			if(err){
				throw err;
			}

			if(!user){
				res.json({
					success:false,
					message: 'Authentication Failed: User not found'
				});
			} else if(user) {

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword){
					res.json({
						success: false,
						message: 'Authentication Failed: Invalid Password'
					});
				} else {
					var token = jwt.sign({
						username: user.username
					}, superSecret, {
						expiresInMinutes: 1440
					});

					res.json({
						success: true,
						message: 'Token Sent',
						token:token
					});
				}
			}
		});
	});


	//Routes for getting single user in API
	userRouter.route('/id/:user_id')
		.get(function(req,res){//Command for getting single user
			User.findById(req.params.user_id, function(err, user){
				if(err)
					return res.send(err);

				res.json({
					user:user
				});
			});
		});


	//Routes for getting single user via username in API
	userRouter.route('/username/:username')
		.get(function(req,res){//Command for getting single user
			User.findOne({
				username: req.params.username
			}).exec(function(err, user){
				if(err)
					return res.send(err);

				res.json({
					user: user
				});
			});
		});

	//Routes for searching userbase
	userRouter.route('/search')
		.get(function(req, res){
			if(!req.query.username){
				res.json({
					message: 'Enter a username to search for'
				});
			} else {
				User.find({
					username: new RegExp(req.query.username,'i')
				}).exec(function(err, users){
					if(err)
						return res.send(err);
					res.json({
						users: users
					});
				});
			}
		});

	//------------------------------------------------Authenticated Routes

	//User API Router Middleware for authenticating Users
	userRouter.use(function(req, res, next){
		//check header for url parameters
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		if(token){

			jwt.verify(token, superSecret, function(err, decoded){
				if(err){
					return res.status(403).send({
						success:false,
						message: 'Failed to authenticate token'
					});
				} else {
					req.decoded = decoded;

					next();
				}
			});
		} else {

			//if there is no token
			//return 403 code
			return res.status(403).send({
				success: false,
				message: 'No token provided'
			});
		}
	});

	//USER ROUTES FOR API

	//get information for current user
	userRouter.get('/me', function(req, res){
			User.findOne({
				username: req.decoded.username
			}).select('username email comments admin').exec(function(err, user){
				if(err)
					return res.send(err);
				res.json({
					user:user
				});
			});
	});

	userRouter.post('/admin/authorize', function(req, res){
		User.findOne({
			username: req.decoded.username
		}).select('admin').exec(function(err, user){
			if(err)
				return res.send(err);
			if(req.body.adminSecret === config.adminSecret)
				user.admin = true;
			else
				user.admin = false;

			user.save(function(err){
				if(err)
					return res.send(err);
				res.json({
					message: 'Success!'
				});
			});
		});
	});

	userRouter.post(':user_id/admin', function(req, res){
		User.findOne({
			_id: req.params.user_id
		}).select('admin username').exec(function(err, user){
			if(err)
				return res.send(err);
			if(!req.decoded.username === user.username){
				return res.json({
					message: 'Not the authenticated user',
					success: false
				});
			} else {
				return res.json({
					message: 'You are an admin!',
					success: true
				});	
			}
		});
	});
	

	userRouter.route('/:user_id')	
		.put(function(req, res){
			User.findOne({
				_id: req.params.user_id
			}).select('username password email comments').exec(function(err, user){
				if(err)
					return res.send(err);
		
				if(!req.body.password)
					return res.json({message: 'Must include password'});
				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword){
					res.json({
						success: false,
						message: 'Update Failed: Invalid Password'
					});
				} else {

					if(req.body.newPassword)
						user.password = req.body.newPassword;

					if(req.body.newEmail)
						user.email = req.body.newEmail;

					if(req.body.newUsername){

						Comment.find({
							author: user.username
						}).exec(function(err, comments){
							if(err)
								return res.send(err);

							if(user.comments.length > 0){
								comments.author = req.body.newUsername;

								user.username = req.body.newUsername;

								user.save(function(err){
									if(err)
										return res.send(err);

									comments.save(function(err){
										if(err)
											return res.send(err);
										res.json({
											message: "User Updated!"
										});
									});
								});
							} else {
								user.username = req.body.newUsername;

								user.save(function(err){
									if(err)
										return res.send(err);

									res.json({
										message: "User Updated!"
									});
								});
							}
						});	
					} else {
						user.save(function(err){
							if(err)
								return res.send(err);
							res.json({
								message: "User Updated!"
							});
						});
					}
				}
			});
		})

		.delete(function(req, res){
			User.findOne({
				_id: req.params.user_id
			}).select('username password').exec(function(err, user){
				//error handling
				if(err)
					return res.send(err);

				if(!user){
					res.json({
						success:false,
						message: 'Deletion Failed: User not found'
					});
				} else if(user) {

					var validPassword = user.comparePassword(req.body.password);

					if(!validPassword){
						res.json({
							success: false,
							message: 'Deletion Failed: Invalid Password'
						});
					} else {
						if(user.comments.length > 0){
							Comment.find({
								author: user.username
							}).exec(function(err, comments){

							});
						} else {
							user.remove(function(err){
								if(err)
									return res.send(err);
								res.json({
									message: 'user deleted'
								});
							});
						}
					};
				};
			});
		});

	return userRouter;
};
	