/************
 * Router.js*
 ************/

// Import
const express = require('express')
const router = express.Router()
const multer = require("multer")

//config multer
const MIME_TYPES = { //type d'image accepté
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ 
    destination: (req, file, callback) => { 
        callback(null, './publics/ressources/images') //lieu de stockage des images
    },
    filename: (req, file, callback) => { //nom de stockage de l'image
        const name = file.originalname.split(' ').join('_'); // remplace les espaces du nom de fichier fournit par un underscore
        const extension = MIME_TYPES[file.mimetype]; // recupere l' extension du fichier
        callback(null, name + Date.now() + '.' + extension); // reconstruit le nom du fichier
    }
});

const upload = multer({ storage: storage });

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
    .post(upload.single('picture'), inside.post)
    .delete(inside.deleteAll)


router.route('/inside/:id')
    .put(upload.single('picture'), inside.put)
    .delete(inside.delete)

module.exports = router