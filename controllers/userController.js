const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Signup (initial users)
exports.signup = async (req, res) => {
  const { name, username, password, role } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already exists' });

    const user = new User({ name, username, password, role });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = generateToken(user._id);
  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
};

// Logout (dummy)
exports.logout = async (req, res) => {
  res.json({ message: 'Logged out' });
};

// ➕ Add new user (superadmin only)
exports.addUser = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    // superadmin can only add users to their own company
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmins can add users' });
    }

    const existing = await User.findOne({ username, company: req.user.company });
if (existing) return res.status(400).json({ message: 'Username already exists in this company' });


    // assign user to same company as superadmin
    const user = new User({
      name,
      username,
      password,
      role,
      company: req.user.company
    });

    await user.save();
    res.status(201).json(user);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getUsers = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'superadmin') {
      filter.company = req.user.company; // restrict to company
    }

    const users = await User.find(filter, '-password').populate('company', 'name');
    res.json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔄 Edit user (superadmin only)
exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.password) {
      const bcrypt = require('bcryptjs');
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// 🗑️ Delete user (superadmin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
