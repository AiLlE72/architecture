const usermodel = require('../database/models/userModel')

module.exports = {
    get: (req, res) => {
        res.render('home')
    },

    post: async (req, res) => {
        const name = req.body.name
        const user = await usermodel.findOne({ name })
        console.log("coucou");

        if (!user) {
            res.render('home')
        } else {
            const password = req.body.password
            usermodel.findOne({ name }, (err, User) => {
                req.session.name = User.name
                req.session.email = User.email

                if (User) {
                    bcrypt.compare(password, User.password, (err, same) => {
                        if (same) {
                            req.session.userId = User._id
                            res.redirect('/')
                        } else if (err) {
                            console.log(err);
                        }
                    })
                }
            })

        }
    }
}