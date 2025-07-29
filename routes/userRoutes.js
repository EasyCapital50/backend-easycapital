const express = require('express');
const { signup, login, logout, addUser, editUser, deleteUser, getUsers } = require('../controllers/userController');
const authenticate = require('../middleware/protect');
const authorizeRoles = require('../middleware/authorize');

const router = express.Router();

// 🔐 Auth Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// 👥 Admin User Management
router.post('/add', authenticate, authorizeRoles('superadmin'), addUser);   
router.get('/get', authenticate, authorizeRoles('superadmin'), getUsers); // Get all users
router.put('/edit/:id', authenticate, authorizeRoles('superadmin'), editUser);          
router.delete('/delete/:id', authenticate, authorizeRoles('superadmin'), deleteUser);     

module.exports = router;
