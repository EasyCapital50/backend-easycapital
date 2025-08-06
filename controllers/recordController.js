const Record = require('../models/Record');

exports.getRecords = async (req, res) => {
  try {
    let records;

    if (req.user.role === 'staff') {
      // Staff can only view their own entries
      records = await Record.find({ createdBy: req.user.id });
    } else {
      // Superadmin and User can view all
      records = await Record.find().populate('createdBy', 'username');
    }

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.addRecord = async (req, res) => {
  try {
    const newRecord = new Record({
      ...req.body,
      createdBy: req.user.id, // 👈 attach logged-in user
    });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Only superadmin can update any record, staff can update their own
    if (req.user.role !== 'superadmin' && record.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this record' });
    }

    Object.assign(record, req.body); // merge updated fields
    await record.save();

    res.status(200).json({ message: 'Record updated successfully', record });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.deleteRecord = async (req, res) => {
  try {
    const deleted = await Record.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
