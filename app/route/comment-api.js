//COMMENTS API ROUTING

var Comment 	= require('../model/comment'),
	User		= require('../model/user'),
	jwt			= require('jsonwebtoken'),
	config		= require('../../server-config'),
	http		= require('http'),
	superSecret	= config.superSecret;

module.exports = function(app, express){


	//Get Instance of express router
	var commentRouter = express.Router();

	commentRouter.route('/page/:page_id')
		.get(function(req, res){
			Comment.find({
				page: req.params.page
			}).exec(function(err, comments){
				if(err)
					return res.send(err);

				return res.json({
					comments: comments
				});
			});
		});

	commentRouter.route('/:comment_id')
		.get(function(req, res){
			Comment.findOne({
				_id: req.params.comment_id
			}).exec(function(err, comment){
				if(err)
					return res.send(err);

				return res.json({
					comment: comment
				});
			});
		});

	//authentication needed routes
	commentRouter.use(function(req, res, next){
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

		

	commentRouter.route('/page/:page_id')
		.post(function(req, res){
			var comment = new Comment();

			User.findOne({
				username:req.decoded.username
			}).exec(function(err, user){
				if(err)
					return res.send(err);
				comment.author = user.username;
				if(!req.body.comment_content)
					return res.json({message: 'Comment requires Content'});
				if(req.body.parent_comment){
					comment.parentComment = req.body.parent_comment;
				}
				else
					comment.parentComment = "";
				comment.content = req.body.comment_content;
				comment.page = req.params.page_id;
				comment.postDate = Date.now();
				user.comments.push(comment._id);

				comment.save(function(err){
					if(err)
						return res.send(err);
					if(comment.parentComment !== ''){
						Comment.findOne({
							_id: comment.parentComment
						}).exec(function(err, parentComment){
							if(err)
								return res.send(err);
							parentComment.childComments.push(comment._id);

							parentComment.save(function(err){
								if(err)
									res.send(err)
								user.save(function(err){
									if(err)
										return res.send(err);
									res.json({
										message: 'Comment Uploaded!'
									});
								});
							});
						});
					} else {
						user.save(function(err){
						if(err)
							return res.send(err);
						res.json({
							message: 'Comment Uploaded!'
						});
					});
					}
				});
			});
		});

	commentRouter.route('/:comment_id')
		.put(function(req, res){
			Comment.findOne({
				_id: req.params.comment_id
			}).exec(function(err, comment){
				if(err)
					return res.send(err);
				if(req.body.comment_content)
					comment.content = req.body.comment_content;
				if(req.decoded.username !== comment.author)
					return res.json({message: 'User does not match comment'});

				comment.save(function(err){
					if(err)
						return res.send(err);

					res.json({
						message: 'Comment updated!'
					});
				})
			});
		})

		.delete(function(req, res){
			Comment.findOne({
				_id: req.params.comment_id
			}).exec(function(err, comment){
				if(err)
					return res.send(err);
				if(req.decoded.username !== comment.author)
					return res.json({message: 'User does not match comment'});
				comment.content = 'DELETED';
				comment.author = 'DELETED';

				User.findOne({
					username: req.decoded.username
				}).exec(function(err, user){
					if(err)
						return res.send(err);
					var i = user.comments.indexOf(comment._id);

					if(i != -1)
						user.comments.splice(i, 1);

					if(comment.parentComment !== ''){
						Comment.findOne({
							_id: comment.parentComment
						}).exec(function(err, parentComment){
							var i = parentComment.childComments.indexOf(comment._id);

							if(i != -1)
								parentComment.childComments.splice(i, 1);

							parentComment.save(function(err){
								if(err)
									return res.send(err);
							});
						});
					}

					if(comment.childComments.length > 0){
						comment.save(function(err){
							if(err)
								return res.send(err);
							user.save(function(err){
								if(err)
									return res.send(err);
								res.json({
									message: 'Comment Deleted!'
								});
							});
						});
					} else {
						comment.remove(function(err){
							if(err)
								return res.send(err);
							user.save(function(err){
								if(err)
									return res.send(err);
								res.json({
									message: 'Comment Deleted!'
								});
							});
						});
					}

				});
			});
		});

	


	return commentRouter;
}