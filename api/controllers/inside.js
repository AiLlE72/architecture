const usermodel = require('../database/models/userModel')


module.exports = {
    get: async (req, res) => {
        const dbuser = await usermodel.find(req.params.id)
        res.redirect('/inside', { dbuser })
    },

    post: (req, res) => {
        const Pass = req.body.password
        const confPass = req.body.confpassword
        const checkbox = req.body.checkbox

        if (Pass !== confPass) {
            res.redirect('/inside')
        } else {
            if (checkbox !== 'on') {
                res.redirect('/inside')
            } else {
                usermodel.create(
                    {
                        name: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                    },
                    res.redirect('/inside')
                )

            }

        }
    },

    put: (req, res) => {
        const myuser = { _id: req.params.id }
        usermodel.findOneAndUpdate(
            myuser,
            {
                name: req.body.username,
                email: req.body.email,
            },
            { multi: true },
            (err) => {
                if (!err) {
                    res.redirect('/inside')
                } else {
                    res.send(err)
                }
            }
        )
    },

    delete: (req, res) => {
        const myuser = { _id: req.params.id }
        usermodel.deleteOne(
            myuser,
            (err) => {
                if (!err) {
                    console.log('supp ok');

                    res.redirect('/inside')
                } else {
                    res.send(err)
                }
            }
        )
    }
}