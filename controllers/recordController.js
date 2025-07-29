const Record = require('../models/Record');

exports.getRecords = async (req, res) => {
  try {
    const query = req.query.query;
    const records = query
      ? await Record.find({ companyName: new RegExp(query, 'i') })
      : await Record.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRecord = async (req, res) => {
  try {
    const newRecord = new Record(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
