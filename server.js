//Import module
const Handlebars = require("handlebars");
const exphbs = require('express-handlebars');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


// Constante
const app = express()
const key = require('./api/controllers/config')
const urlDB = key.urlDBcloud //key.urlDBlocal
const port = process.env.PORT || 3000

// Handlebars
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

//Moment
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);

// Method-Override
app.use(methodOverride('_method'));

// Body Parser 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//express-handlebars
// app.use(express.static('publics')); //utile si un fichier css est present dans le dossier public
app.use('/assets', express.static('publics'))


// Mongoose
mongoose.connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

// Router
const router = require('./api/router')
app.use("/", router)

// Port
app.listen(port, function () {
    console.log("Le serveur tourne sur le port : " + port);
})

