const usermodel = require('../database/models/userModel')
const fs = require('fs')
const path = require('path')


module.exports = {

    // *************fonction POST***************
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
                        image: `/assets/ressources/images/${req.file.filename}`,
                        img: req.file.path,
                        password: req.body.password,
                    },
                    (error, post) => {
                        res.redirect('/inside')
                    })
            }
        }
    },

    // *************fonction GET***************
    get: async (req, res) => {
        const dbuser = await usermodel.find(req.params.id)
        res.render('inside', { dbuser })
    },

    logout: (req, res, next) => {
        req.session.destroy(() => {
            res.clearCookie,
            res.redirect('/')
        })
    },

    // *************fonction PUT***************
    put: async (req, res) => {
        const myuser = await usermodel.findById({ _id: req.params.id })
        const pathImg = await myuser.img

        if (!req.file) {
            usermodel.updateOne(
                myuser,
                {
                    name: req.body.username,
                    email: req.body.email,
                    isAdmin: req.body.select
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
        } else {
            fs.unlink(
                pathImg,
                (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        usermodel.updateOne(
                            myuser,
                            {
                                name: req.body.username,
                                email: req.body.email,
                                image: `/assets/ressources/images/${req.file.filename}`,
                                img: req.file.path,
                            },
                            { multi: true },
                            (err) => {
                                if (err) {
                                    res.send(err)
                                } else {
                                    res.redirect('/inside')

                                }
                            }
                        )
                    }
                })
        }
    },

    // *************fonction DELETE***************
    delete: async (req, res) => {
        const myuser = await usermodel.findById({ _id: req.params.id })
        const pathImg = myuser.img

        usermodel.deleteOne(
            myuser,
            (err) => {
                if (err) {
                    res.send(err)
                } else {
                    fs.unlink(pathImg,
                        (err) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('photo effacé');

                                res.redirect('/inside')
                            }
                        })
                }
            }
        )
    },

    // *************fonction DELETEALL***************
    deleteAll: (req, res) => {
        const directory = path.resolve("publics/ressources/images")
        usermodel.deleteMany((err) => {
            if (!err) {
                fs.readdir(directory, (err, files) => {
                    if (!err) {
                        for (const file of files) {
                            fs.unlink(path.join(directory, file), (err) => {
                                if (!err) {
                                    // console.log('image effacé ?');
                                } else {
                                    console.log(err);
                                }
                            })
                        }
                        res.redirect('/inside')
                    } else {
                        console.log(err);
                    }
                })
            } else {
                res.send(err)
            }
        })
    }
}
