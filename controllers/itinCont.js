// const express= require('express');
const Itinerary = require('../models/itinerary.js')

function capitalizeTitle(title){
    return title
    .split(' ') //
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
const createItinerary= async (req,res) => {
    try {
        console.log("User ID from session:", req.session.userId) //debugging
        const { title, duration, budget, privacy} = req.body;
        const newItinerary = new Itinerary({
            title: capitalizeTitle(req.body.title),
            duration,
            budget,
            privacy,
            createdBy: req.session.userId
        });
        await newItinerary.save();
        res.redirect(`/itineraries/${newItinerary._id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send('First Server Error');
    }
};

const viewItineraries = async (req, res) => {
    console.log("User ID from session:", req.session.userId);
    try {
        const itineraries = await Itinerary.find({ createdBy: req.session.userId });
        console.log("Itineraries found:", itineraries);
        res.render('index.ejs', { itineraries });
    } catch (err) {
        console.log("Error in viewItineraries:", err);
        res.status(500).send('Server error here');
    }
};


const viewItinerary = async (req,res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id)
        if (!itinerary) {
            return res.status(404).send('Itinerary not found');
        }
        res.render('itineraries/details.ejs', {itinerary});
    } catch (err) {
        console.log(err);
        res.status(500).send("Here's the Server Error");
    }
};

const editItineraryForm = async (req,res) => {
    try {
        const itinerary= await Itinerary.findById(req.params.id);
        if (!itinerary) {
            return res.status(404).send("Itinerary not found");
        }
        res.render('itineraries/edit', {itinerary});
    } catch (err) {
        console.log(err);
        res.status(500).send('Here Ye: Server error')
    }
};

const updateItinerary = async (req,res) => {
    try {
        const { title, duration, budget, privacy} = req.body;
        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            req.params.id,
            {title, duration, budget, privacy},
            {new: true }
        );
        if (!updatedItinerary) {
            return res.status(404).send('Itinerary not found.');
        }
        res.redirect(`/itineraries/${updatedItinerary._id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Yay! Server Error');
    }
};

const deleteItinerary = async (req,res) => {
    try {
        const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
        if (!deletedItinerary) {
            return res.status(404).send('Itinerary not found');
        }
        res.redirect('/itineraries');
    } catch (err) {
        console.log(err);
        res.status(500).send('Last Server Error')
    }
}

module.exports = {
    createItinerary,
    viewItineraries,
    viewItinerary,
    editItineraryForm,
    updateItinerary,
    deleteItinerary,
};
