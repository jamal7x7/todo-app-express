const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

const uri0 = 'mongodb://localhost:27017/Todoooooos'

const db_coll = 'Todos'

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

const Todos = mongoose.model('todos', {
	text: String,
	completed: Boolean
})
const t1 = new Todos({
	text: 'Rayane',
	completed: false
})

// t1.save().then(t => console.log('saved!'))

// Todos.find().then(t => console.log(t))

module.exports = { Todos }
