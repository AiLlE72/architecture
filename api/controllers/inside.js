const usermodel = require('../database/models/userModel')
const fs = require('fs')
const path = require('path')


module.exports = {
    get: async (req, res) => {
        const dbuser = await usermodel.find(req.params.id)
        res.render('inside', { dbuser })
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
                        image: `/assets/ressources/images/${req.file.originalname}`,
                        img: req.file.originalname,
                        password: req.body.password,
                    },
                    (error, post) => {
                        res.redirect('/inside')
                    })
            }
        }
    },

    put: (req, res) => {
        const myuser =  usermodel.findById({ _id: req.params.id })
        console.log(myuser)
        console.log(req.file)
        console.log(req.body)

        if (!req.file){
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
        } else {
            usermodel.findOneAndUpdate(
                myuser,
                {
                    name: req.body.username,
                    email: req.body.email,
                    image: req.file.path,
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
        } 
    },

    delete: async (req, res) => {
        const myuser = await usermodel.findById({ _id: req.params.id })
        const pathImg = myuser.image

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
                                res.redirect('/inside')
                            }
                        })
                }
            }
        )
    },

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
