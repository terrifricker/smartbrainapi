const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const signin = require('./controllers/signin')
const register = require('./controllers/register')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

// set database
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : '',
      database : 'smart-brain'
    }
  });

const app = express()

// middleware
app.use(bodyParser.json())
app.use(cors())

// endpoints
app.get('/', (req, res) => res.json("success"))

app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt))

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))

app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db))

app.put('/image', (req, res) => image.handleImage(req, res, db))

app.listen(3001, () => {
    console.log('App is running on port 3001.')
})
