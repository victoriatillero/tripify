const Itinerary = require('../models/itinerary.js');
const User = require('../models/user.js');

function capitalizeTitle(title) {
  return title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const createItinerary = async (req, res) => {
  try {
    const duration = parseInt(req.body.duration);
    const days = Array.from({ length: duration }, (_, i) => ({
      dayNumber: i + 1,
      activities: [],
    }));

    const newItinerary = await Itinerary.create({
      title: capitalizeTitle(req.body.title),
      duration,
      budget: req.body.budget || 0,
      privacy: req.body.privacy,
      createdBy: req.session.userId,
      days,
      coverPhoto: req.body.coverPhoto || null
    });

    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).send('User not found');


    user.itineraries.push(newItinerary._id);
    await user.save();

    res.redirect(`/itineraries/${newItinerary._id}`);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const addActivityToDay = async (req, res) => {
  const { dayNumber, title, description, time, location } = req.body;
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).send("Itinerary not found.");

    const day = itinerary.days.find(d => d.dayNumber === parseInt(dayNumber));
    if (!day) return res.status(404).send("Day not found");

    day.activities.push({ title, description, time, location });
    await itinerary.save();

    res.redirect(`/itineraries/${itinerary._id}/edit`);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
const editActivityForm = async (req, res) => {
  const { id, dayNumber, activityIndex } = req.params;

  try {
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) return res.status(404).send("Itinerary not found");

    const day = itinerary.days.find(d => d.dayNumber === parseInt(dayNumber));
    if (!day) return res.status(404).send("Day not found");

    const activity = day.activities[activityIndex];
    if (!activity) return res.status(404).send("Activity not found");

    res.render('itineraries/editActivity.ejs', {
      itineraryId: id,
      dayNumber,
      activityIndex,
      activity
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const updateActivity = async (req, res) => {
  const { id, dayNumber, activityIndex } = req.params;
  const { title, description, time, location } = req.body;

  try {
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) return res.status(404).send("Itinerary not found");

    const day = itinerary.days.find(d => d.dayNumber === parseInt(dayNumber));
    if (!day) return res.status(404).send("Day not found");

    const activity = day.activities[activityIndex];
    if (!activity) return res.status(404).send("Activity not found");

    activity.title = title;
    activity.description = description;
    activity.time = time;
    activity.location = location;

    await itinerary.save();
    res.redirect(`/itineraries/${id}/edit`);
  } catch (err) {
    console.error("Error updating activity:", err);
    res.status(500).send("Server error");
  }
};

const deleteActivity = async (req, res) => {
  const { id, dayNumber, activityIndex } = req.params;

  try {
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) return res.status(404).send("Itinerary not found");

    const day = itinerary.days.find(d => d.dayNumber === parseInt(dayNumber));
    if (!day) return res.status(404).send("Day not found");

    if (activityIndex < 0 || activityIndex >= day.activities.length) {
      return res.status(400).send("Invalid activity index");
    }

    day.activities.splice(activityIndex, 1);
    await itinerary.save();

    res.redirect(`/itineraries/${id}/edit`);
  } catch (err) {
    res.status(500).send("Server error while deleting activity");
  }
};

const viewItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ createdBy: req.session.userId });
    res.render('itineraries/index.ejs', { itineraries });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const viewItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).send('Itinerary not found');

    res.render('itineraries/details.ejs', { itinerary });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const editItineraryForm = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).send("Itinerary not found");

    res.render('itineraries/edit.ejs', { itinerary });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const updateItinerary = async (req, res) => {
  try {
    const { title, duration, budget, privacy, coverPhoto } = req.body;
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) return res.status(404).send("Itinerary not found.");

    //update General Itinerary fields
    itinerary.title = capitalizeTitle(title);
    itinerary.duration = parseInt(duration);
    itinerary.budget = budget;
    itinerary.privacy = privacy;
    itinerary.coverPhoto = coverPhoto || null;

    // Sync days if duration updated
    const newDuration = parseInt(duration);
    const currentDuration = itinerary.days.length;

    if (newDuration > currentDuration) {
      for (let i = currentDuration + 1; i <= newDuration; i++) {
        itinerary.days.push({ dayNumber: i, activities: [] });
      }
    } else if (newDuration < currentDuration) {
      itinerary.days = itinerary.days.slice(0, newDuration);
    }

    await itinerary.save();
    res.redirect(`/itineraries/${itinerary._id}`);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const deleteItinerary = async (req, res) => {
  try {
    const itineraryId = req.params.id;

    const deletedItinerary = await Itinerary.findByIdAndDelete(itineraryId);
    if (!deletedItinerary) {
      return res.status(404).send('Itinerary not found');
    }
    const User=require('../models/user.js')
    await User.findByIdAndUpdate(
      req.session.userId,
      { $pull: { itineraries: itineraryId } }
    );

    res.redirect('/profile');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = {
  createItinerary,
  addActivityToDay,
  editActivityForm,
  updateActivity,
  deleteActivity,
  viewItineraries,
  viewItinerary,
  editItineraryForm,
  updateItinerary,
  deleteItinerary,
};
