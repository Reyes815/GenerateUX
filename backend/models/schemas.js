const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {type:String},
    lastname: {type:String},
    username: {type:String},
    password: {type:String},
    entryDate: {type:Date, default:Date.now}
})

const Users = mongoose.model('Users', userSchema, 'User')
const mySchemas = {'Users':Users}

module.exports = mySchemas