const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController.js')

router.post('/create', itineraryController.createItinerary);
router.get('/', itineraryController.viewItineraries);
router.get('/:id', itineraryController.viewItinerary);

router.get('/:id/edit', itineraryController.editItineraryForm);

router.put('/:id', itineraryController.updateItinerary);

router.delete('/:id', itineraryController.deleteItinerary);

module.exports = router;
