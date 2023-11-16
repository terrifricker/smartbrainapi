const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')({
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
app.get('/', (req, res) => {
    res.json("success")
})

app.post('/signin', (req, res) => {
    knex('login')
        .select('hash', 'email')
        .where({email: req.body.email})
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if (isValid) {
                knex('users')
                    .select('*')
                    .where({email: req.body.email})
                    .then(user => res.json(user[0]))
                    .catch(error => res.status(400).json('unable to signin'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(error => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body
    const hash = bcrypt.hashSync(password)
    knex.transaction(trx => {
        trx('login').insert({
            email: email,
            hash: hash
        })
        .returning('email')
        .then(loginEmail => {
            trx('users').insert({
                name: name,
                email: loginEmail[0].email,
                joined: new Date()
            })
            .returning('*')
            .then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params
    knex('users').select('*')
        .where({id: id})
        .then(user => res.json(user[0]))
        .catch(error => res.status(400).json('user not found'))
})

app.put('/image', (req, res) => {
    let {id} = req.body
    console.log("req.body: ", req.body)
    console.log("id: ", id)
    knex.transaction(trx => {
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
