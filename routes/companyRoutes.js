const express = require('express');
const { createCompany, listCompanies, updateCompany, deleteCompany } = require('../controllers/companyController');
const authenticate = require('../middleware/protect');
const authorizeRoles = require('../middleware/authorize');

const router = express.Router();

// Company routes (mainadmin only)
router.post('/company', authenticate, authorizeRoles('mainadmin'), createCompany);

// Company admin adds users

router.get('/list', listCompanies);

router.put('/company/:id', authenticate, authorizeRoles('mainadmin'), updateCompany);

router.delete('/company/:id', authenticate, authorizeRoles('mainadmin'), deleteCompany);



module.exports = router;
