const handleProfile = (req, res, db) => {
    const {id} = req.params
    db('users').select('*')
        .where({id: id})
        .then(user => res.json(user[0]))
        .catch(error => res.status(400).json('user not found'))
}

module.exports = { handleProfile }