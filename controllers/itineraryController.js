const Itinerary = require('../models/itinerary.js')

const createItinerary= async (req,res) => {
    try {
        const { title, duration, budget, privacy} = req.body;
        const newItinerary = new Itinerary({
            title,
            duration,
            budget,
            privacy,
            createdBy: req.session.userId
        });
        await newItinerary.save();
        res.redirect(`/itineraries/${newItinerary._id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

const viewItineraries = async (req,res) => {
    try {
        const itineraries = await Itinerary.find({createdBy: req.session.userId});
        res.render('itineraries/index', {itineraries});
    }catch (err){
        console.log(err);
        reset.status(500).send('Server error');
    }
}

const viewItinerary = async (req,res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id).populate('days');
        if (!itinerary) {
            return res.status(404).send('Itinerary not found');
        }
        res.render('itineraries/show', {itinerary});
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
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
        res.status(500).send('Server error')
    }
};

const updateItinerary = async (req,res) => {
    try {
        const { title, duration, budget, privacy} = req.body;
        const updateItinerary = await Itinerary.findByIdAndUpdate(req.params.id,
            {title, duration, budget, privacy},
            {new: true }
        );
        if (!updatedItinerary) {
            return res.status(404).send('Itinerary not found.');
        }
        res.redirect(`/itineraries/${updatedItinerary._id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
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
        res.status(500).send('Server Error')
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
