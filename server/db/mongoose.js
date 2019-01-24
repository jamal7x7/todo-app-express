const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const uri0 = 'mongodb://localhost:27017/Todoooooos'

const db_coll = 'TodosColl'

const uri =
	'mongodb+srv://jamal123:' +
	'jamal123' +
	'@jamalcluster-vebwi.mongodb.net/' +
	db_coll +
	'?retryWrites=true/'

mongoose.connect(
	uri,
	{ useNewUrlParser: true }
)

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
	console.log("we're connected!")
})

const Todo = mongoose.model('todos', {
	text: String,
	completed: Boolean
})
// const t1 = new Todo({
// 	text: 'Rayane',
// 	completed: false
// })
const User = mongoose.model('users', {
	email: String,
	password: String
})
// const u1 = new User({
// 	email: 'j',
// 	password: 'j'
// })

// t1.save().then(t => console.log('todo saved!'))
// u1.save().then(t => console.log('user saved!'))

// Todo.find().then(t => console.log(t))
// user.find().then(u => console.log(u))

module.exports = { Todo, User }
