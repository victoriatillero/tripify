const mongoose = require('mongoose');
const bcrypt= require('bcrypt');
const Schema= mongoose.Schema;

const userSchema= new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.methods.comparePassword= async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User= mongoose.model('User', userSchema);

module.exports= User;
