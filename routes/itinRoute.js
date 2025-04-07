const express = require('express');
const router = express.Router();
const itinCont = require('../controllers/itinCont.js');

router.get('/', itinCont.viewItineraries);
router.post('/', itinCont.createItinerary);
router.get('/:id', itinCont.viewItinerary)
router.get('/:id/edit', itinCont.editItineraryForm);
router.put('/:id', itinCont.updateItinerary);
router.delete('/:id', itinCont.deleteItinerary);


router.post('/:id/add-activity', itinCont.addActivityToDay);
router.get('/:id/days/:dayNumber/activities/:activityIndex/edit', itinCont.editActivityForm);
router.put('/:id/days/:dayNumber/activities/:activityIndex', itinCont.updateActivity);
router.delete('/:id/days/:dayNumber/activities/:activityIndex', itinCont.deleteActivity)









module.exports=router;
