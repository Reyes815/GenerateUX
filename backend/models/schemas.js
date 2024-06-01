const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    password: { type: String },
    entryDate: { type: Date, default: Date.now }
});

const wireframeSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' }, 
    htmlCode: { type: String, text: true }
});

const Users = mongoose.model('Users', userSchema, 'User');
const Wireframe = mongoose.model('Wireframe', wireframeSchema, 'Wireframe');

const mySchemas = {
    'Users': Users,
    'Wireframe': Wireframe
};

module.exports = mySchemas;
