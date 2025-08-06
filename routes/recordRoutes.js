const express = require('express');
const authenticate = require('../middleware/protect');
const authorizeRoles = require('../middleware/authorize');
const {
  getRecords,
  addRecord,
  deleteRecord,
  updateRecord
} = require('../controllers/recordController');

const router = express.Router();

router.get('/get', authenticate, getRecords);

router.post('/post', authenticate, authorizeRoles('superadmin', 'staff'), addRecord);

router.delete('/:id', authenticate, authorizeRoles('superadmin'), deleteRecord);

router.put('/:id', authenticate, authorizeRoles('superadmin', 'staff'), updateRecord); // ✅

module.exports = router;
