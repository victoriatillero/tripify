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
    budget: {
        type: Number,
        default: 0,
        min: 0
    },
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
    days: [
        {
            dayNumber: Number,
            activities: [
                {
                    title: String,
                    description: String,
                    time: String,
                    location: String
        }
    ]
}],
    coverPhoto: {
        type: String,
        required: false,
    }
});
const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary
