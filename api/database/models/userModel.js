const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    name:  String,
    email: String,
    image : String,
    password: String,
    createDate : {
        type: Date,
        default : new Date()
    },
    
})

userSchema.pre('save', function ( next ) {
    const user = this
    bcrypt.hash(user.password, 10, (err, encrypted) => {
        user.password = encrypted
        next()
    })

})


module.exports = mongoose.model('usercollection', userSchema)