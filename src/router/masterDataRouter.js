const express = require('express');
const router = express.Router();
const MasterDataController = require('../controllers/masterDataController');
const masterDataController = new MasterDataController();
const auth = require('../middleware/auth');

router.post('/department', auth, masterDataController.createDepartment);
router.put('/department/:id', auth, masterDataController.updateDepartment);
router.delete('/department/:id', auth, masterDataController.deleteDepartment);
router.get('/department/:id', auth, masterDataController.getDepartmentById);
router.get('/department', auth, masterDataController.getAllDepartment);

router.post('/designation', auth, masterDataController.createDesignation);
router.put('/designation/:id', auth, masterDataController.updateDesignation);
router.delete('/designation/:id', auth, masterDataController.deleteDesignation);
router.get('/designation/:id', auth, masterDataController.getDesignationById);
router.get('/designation', auth, masterDataController.getAllDesignation);

module.exports = router;
