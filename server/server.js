const express = require('express')
const fs = require('fs')
const path = require('path')
const shortid = require('shortid')
const session = require('express-session')
const app = express()
const { Todo, User } = require('./db/mongoose.js')

const {
	PORT = 5000,
	TWO_HOURS = 2 * 3600000,
	NODE_ENV = 'developement'
} = process.env

app.set('view engine', 'pug')

// register the bodyPareser middleware for processing forms
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '..', '/public')))

// register session with it's secret ID
app.use(
	session({
		name: 'kid',
		secret: 'Jamal',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: TWO_HOURS,
			secure: process.env.NODE_ENV === 'production'
		}
	})
)

// LOGS
const util = require('util')
app.use((req, res, next) => {
	// console.log('shortId: ', shortid.generate())
	// console.log('secret: ', req.session.secret)
	fs.appendFile(
		'./logFile.log',
		// JSON.stringify(req.session, null, 2),
		'// ================The Req Object: ================\n' +
			util.inspect(req.session) +
			'\n',
		err => err
	)
	next()
})

const loggedIn = (req, res, next) => {
	// if (req.session.email === 'j' && req.session.password === 'j') {
	// 	next()
	// } else {
	// 	res.status(401).redirect('/home')
	// }

	User.findOne(
		{ email: req.session.email, password: req.session.password },
		(err, user) => {
			if (err) {
				return res.status(500).redirect('login')
			}
			if (!user) {
				return res.status(404).redirect('login')
			}
			next()
			// return res.status(200).send('welcome,', user)
		}
	)
}

app.get('/home', (req, res) => {
	res.render('home')
})

// LOGIN ROUTE
app.get('/login', (req, res) => {
	res.render('login', {
		name: t
	})
})

app.post('/login', (req, res, next) => {
	req.session.email = req.body.email
	req.session.password = req.body.password
	res.redirect('/')
})

// POST ROUTE
app.get('/register', (req, res) => {
	res.render('register', {
		name: t
	})
})

app.post('/register', (req, res, next) => {
	req.session.email = req.body.email
	req.session.password = req.body.password

	const u2 = new User({
		email: req.session.email,
		password: req.session.password
	})

	// localStorage.setItem('k', 'cat')
	// localStorage.getItem('k')

	console.log('from register!')

	u2.save().then(t => console.log('user saved!'))

	res.redirect('/')
})

app.get('/', loggedIn, (req, res) => {
	res.redirect('home')
})
// LOGGED ROUTE
app.get('/logged', (req, res) => {
	res.redirect('addTodo')
})

// LOGOUT ROUTE
app.get('/logout', (req, res) => {
	req.session.destroy(e => {
		if (e) {
			res.negotiate(e)
		}
		// console.log('secret: ', req.session)
		res.redirect('/')
	})
})

let t = []

// YOUR APP
app.get('/addTodo', loggedIn, (req, res) => {
	res.render('addTodo', {
		name: t
	})
})

app.post('/addTodo', (req, res) => {
	t = [...t, req.body.name]
	// console.log(t)
	res.redirect('addTodo')
})

app.get('/dashboard', loggedIn, (req, res) => {
	res.status(200).send('Welcome to your top-secret dashboard!')
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
