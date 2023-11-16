const handleImage = (req , res, db) => {
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
}

module.exports = { handleImage }