const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const TicketController = new ticketController();
const auth = require('../middleware/auth');

router.post('/ticket', auth, TicketController.create);
router.put('/ticket/:id', auth, TicketController.update);
router.get('/ticket', auth, TicketController.getAllTickets);
router.get('/ticket/:id', auth, TicketController.getSingleTicket);
router.delete('/ticket/:id', auth, TicketController.delete);

module.exports = router;
