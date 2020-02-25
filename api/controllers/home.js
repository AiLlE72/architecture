const usermodel = require('../database/models/userModel')
const bcrypt = require('bcrypt')

module.exports = {
    get: (req, res) => {
        res.render('home')
    },

    post: async (req, res) => {
        const name = req.body.name
        const password = req.body.password
        const User = await usermodel.findOne({ name: name })

        if (!User) {
            res.render('home')
        } else {
            bcrypt.compare(password, User.password, (err, same) => {
                if (!same) {
                    res.render('home')
                } else {
                    res.redirect('/inside')
                }
            })
        }
    }
}