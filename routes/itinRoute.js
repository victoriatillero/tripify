const express = require('express');
const router = express.Router();
const itinCont = require('../controllers/itinCont.js')


router.post('/itineraries', itinCont.createItinerary);

router.get('/itineraries', itinCont.viewItineraries);
router.get('/itineraries/:id', itinCont.viewItinerary);

router.get('/:id/edit', itinCont.editItineraryForm);

router.put('/:id', itinCont.updateItinerary);

router.delete('/:id', itinCont.deleteItinerary);

module.exports = router;
