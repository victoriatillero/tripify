const mongoose = require('mongoose');
const bcrypt= require('bcrypt');
const Schema= mongoose.Schema;

const userSchema= new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type:String,
        required:true,
    },
    password: {
        type: String,
        required: true,
    },
    itineraries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary'
    }]
})

userSchema.methods.comparePassword= async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User= mongoose.model('User', userSchema);

module.exports= User;
