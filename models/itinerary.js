const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    budget: Number,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    privacy: {
        type: String,
        required: true,
        enum:['public', 'private',]
    },
    days: [{
        title: String,
        activities: [ {
            name: String,
            time: String,
            description: String,
        }]
    }],
});
const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary
