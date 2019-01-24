const express = require('express')
const fs = require('fs')
// const bodyParser = require('body-parser')
const path = require('path')
const shortid = require('shortid')
const session = require('express-session')
const app = express()
const { Todos } = require('./db/mongoose.js')

const { port = 5000, TWO_HOURS = 2 * 3600000 } = process.env

app.set('view engine', 'pug')

// register the bodyPareser middleware for processing forms
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '..', '/public')))

// register session with it's secret ID
app.use(
	session({
		secret: 'Jamal',
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: TWO_HOURS
		}
	})
)

// LOGS
const util = require('util')
app.use((req, res, next) => {
	console.log('shortId: ', shortid.generate())
	console.log('secret: ', req.session.secret)
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

// LOGIN ROUTE
app.get('/login', (req, res) => {
	res.render('login', {
		name: t
	})
})

app.post('/login', (req, res, next) => {
	req.session.email = req.body.email
	req.session.password = req.body.password
	// res.end(
	// 	`Done, your email is : ${req.session.email} & your pass is: ${
	// 		req.session.password
	// 	}`
	// )
	res.redirect('/')
})

app.get('/', (req, res) => {
	if (req.session.email === 'j' && req.session.password === 'j') {
		res.redirect('logged')
	} else {
		res.redirect('login')
	}
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
		console.log('secret: ', req.session)
		res.redirect('/')
	})
})

let t = []

// YOUR APP
app.get('/addTodo', (req, res) => {
	if (req.session.email === 'j' && req.session.password === 'j') {
		res.render('addTodo', {
			name: t
		})
	} else {
		res.redirect('/')
	}
})

app.post('/addTodo', (req, res) => {
	// console.log(req.body.name)
	t = [...t, req.body.name]
	console.log(t)
	res.redirect('addTodo')
})

app.listen(port, () => console.log(`lestning on port ${port}`))
