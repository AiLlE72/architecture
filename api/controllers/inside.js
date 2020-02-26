const usermodel = require('../database/models/userModel')
const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')

// *************parametrage nodemailer***************

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: "test.willy72@gmail.com",
        pass: "totocaca"
    },
    tls: {
        rejectUnauthorized: false
    }
})

var rand, mailOptions, host, link


module.exports = {

    // *************fonction POST***************
    post: (req, res) => {
        const Pass = req.body.password
        const confPass = req.body.confpassword
        const checkbox = req.body.checkbox

        // Nodemailer config  
        rand = Math.floor((Math.random() * 100) + 54)
        host = req.get('host')
        link = "http://" + req.get('host') + "/verify/" + rand
        mailOptions = {
            from: 'test.willy72@gmail.com',
            to: req.body.email,
            subject: 'Merci de confirmer votre compte email',
            rand: rand,
            html: "Bonjour, j'ai voulu faire un truc beau... mais on va faire simple.<br> Merci de cliquer sur ce lien pour verifier votre adresse mail <br><a href=" + link + ">Cliquer ici pour verifier</a>",
        }


        if (Pass !== confPass) {
            res.redirect('/inside')
        } else {
            if (checkbox !== 'on') {
                res.redirect('/inside')
            } else {
                if (!req.file) {
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
                        // Nodemailer transport      
                        transporter.sendMail(mailOptions, (err, res, next) => {
                            if (err) {
                                console.log("erreur dans l'envoi du mail");
                                console.log(err)
                                res.send(err)
                            } else {
                                console.log('Message envoyé');
                                next()
                            }
                        }),
                        (error, post) => {
                            res.redirect('/inside')
                        })

                }
            }
        }
    },

    // *************Page de verification d'email***************
    verifMail: async (req, res, next) => {
        const userID = await usermodel.findOne({ email: mailOptions.to })
        query = { _id: userID._id }

        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
            console.log("Domain is matched. Information is from Authentic email")
            if (req.params.id == mailOptions.rand) {

                usermodel.findByIdAndUpdate(
                    { _id: userID._id },
                    {
                        isVerified: true
                    },
                    (err) => {
                        if (!err) {
                            res.redirect('/verifMail')
                        } else {
                            res.rend(err)
                        }
                    }
                )
            } else {
                res.send(" Bad Request")
            }
        } else {
            res.send('Request is from unknow source')
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
