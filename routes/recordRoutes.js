const express = require('express');
const authenticate = require('../middleware/protect');
const authorizeRoles = require('../middleware/authorize');
const {
  getRecords,
  addRecord,
  deleteRecord
} = require('../controllers/recordController');

const router = express.Router();

// 🔐 Authenticated users can view records
router.get('/get', authenticate, getRecords);

// 🛡️ Only superadmin or staff can add records
router.post('/post', authenticate, authorizeRoles('superadmin', 'staff'), addRecord);

// ❌ Only superadmin can delete records
router.delete('/:id', authenticate, authorizeRoles('superadmin'), deleteRecord);

module.exports = router;
