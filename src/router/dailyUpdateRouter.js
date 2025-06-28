const express = require('express');
const router = express.Router();
const dailyUpdateController = require('../controllers/dailyUpdateController');
const DailyUpdateController = new dailyUpdateController();
const auth = require('../middleware/auth');

router.post('/dailyUpdate', auth, DailyUpdateController.create);
router.put('/dailyUpdate/:id', auth, DailyUpdateController.update);
router.get('/dailyUpdate', auth, DailyUpdateController.getAllUpdates);
router.get('/my-dailyUpdate', auth, DailyUpdateController.getMyUpdate);
router.get('/dailyUpdate-excel', auth, DailyUpdateController.getDailyUpdateExcel);
router.get('/dailyUpdate/:id', auth, DailyUpdateController.getSingleUpdate);
router.delete('/dailyUpdate/:id', auth, DailyUpdateController.delete);

module.exports = router;
