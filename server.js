const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const signin = require('./controllers/signin')
const register = require('./controllers/register')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

// set port
const port = process.env.PORT || 3001;

// set database
const db = knex({
    client: 'pg',
    connection: {
      host : 'dpg-cma6u2md3nmc73cmvtbg-a.oregon-postgres.render.com',
      port : 5432,
      user : 'find_a_face_admin',
      password : 'rmyOI6ZdzKglnG0nWJh91OU1MV6GbqKN',
      database : 'find_a_face_db',
      ssl: true,
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

app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})
