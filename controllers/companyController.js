const Company = require('../models/Company');
const User = require('../models/User');

// Main admin creates company
exports.createCompany = async (req, res) => {
  try {
    if (req.user.role !== 'mainadmin') {
      return res.status(403).json({ message: 'Only main admins can create companies' });
    }

    const { name, adminName, adminUsername, adminPassword } = req.body;

    const existing = await Company.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Company already exists' });

    // Step 1: Create the company
    const company = await Company.create({ name, createdBy: req.user.id });

    // Step 2: Create the superadmin of that company
    const companySuperAdmin = new User({
      name: adminName,
      username: adminUsername,
      password: adminPassword,
      role: 'superadmin',   // changed from companyadmin → superadmin
      company: company._id
    });
    await companySuperAdmin.save();

    res.status(201).json({
      company,
      superadmin: companySuperAdmin
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.listCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select('name createdAt'); 
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    if (req.user.role !== 'mainadmin') {
      return res.status(403).json({ message: 'Only main admins can edit companies' });
    }

    const { id } = req.params;
    const { name } = req.body;

    const company = await Company.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json(company);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete company (mainadmin only)
exports.deleteCompany = async (req, res) => {
  try {
    if (req.user.role !== 'mainadmin') {
      return res.status(403).json({ message: 'Only main admins can delete companies' });
    }

    const { id } = req.params;

    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Optional: also delete users under this company
    await User.deleteMany({ company: id });

    res.status(200).json({ message: 'Company and related users deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};