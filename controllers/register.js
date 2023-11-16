const handleRegister = (req, res, db, bcrypt) => {
    const {name, email, password} = req.body
    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {
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
}

module.exports = { handleRegister }