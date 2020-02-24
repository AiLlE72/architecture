/************
 * Router.js*
 ************/

// Import
const express = require('express')
const router = express.Router()

// Import de controllers
const home = require('./controllers/home')
const inside = require('./controllers/inside')

/******** PAGE ACCUEIL **********/
// Home
router.route('/')
    .get(home.get)
    .post(home.post)

//Inside
router.route('/inside')
    .get(inside.get)
    .post(inside.post)


router.route('/inside/:id')
    .put(inside.put)
    .delete(inside.delete)

module.exports = router