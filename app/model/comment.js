//COMMENT MODEL

var mongoose 	= require('mongoose'),
	Schema		= mongoose.Schema;

//--------------------------Setting up the Comment Model

var CommentSchema = new Schema({
	author: {
		type: String,
		required: true,
	},
	parentComment: {
		type:String
	},
	childComments: {
		type: Array
	},
	postDate: {
		type: Date,
		default: Date.now,
		required:true
	},
	page: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
});


//export the Comment MODEL
module.exports = mongoose.model('Comment', CommentSchema);