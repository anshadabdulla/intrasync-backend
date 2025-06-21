const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const TicketController = new ticketController();
const auth = require('../middleware/auth');

router.post('/ticket',auth, TicketController.create);

module.exports = router;
