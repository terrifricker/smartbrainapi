const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const signin = require('./controllers/signin')
const register = require('./controllers/register')

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

app.get('/profile/:id', (req, res) => {
    const {id} = req.params
    db('users').select('*')
        .where({id: id})
        .then(user => res.json(user[0]))
        .catch(error => res.status(400).json('user not found'))
})

app.put('/image', (req, res) => {
    let {id} = req.body
    console.log("req.body: ", req.body)
    console.log("id: ", id)
    db.transaction(trx => {
        trx('users')
        .select('entries')
        .where({id: id})
        .returning('entries')
        .then(response => {
            trx('users')
                .where({id: id})
                .update({entries: parseInt(response[0].entries) + 1})
                .returning('entries')
                .then(response => {
                    console.log("second response: ", response)
                    res.json(response[0].entries)})
                .catch(error => res.status(400).json('entries update failed'))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
})


app.listen(3001, () => {
    console.log('App is running on port 3001.')
})
