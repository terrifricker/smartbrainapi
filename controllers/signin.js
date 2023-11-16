const handleSignIn = (req, res, db, bcrypt) => {
    db('login')
        .select('hash', 'email')
        .where({email: req.body.email})
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if (isValid) {
                db('users')
                    .select('*')
                    .where({email: req.body.email})
                    .then(user => res.json(user[0]))
                    .catch(error => res.status(400).json('unable to signin'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(error => res.status(400).json('wrong credentials'))
}

module.exports = { handleSignIn }