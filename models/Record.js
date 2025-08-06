const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  companyName: String,
  customerName: String,
  mobile: String,
  place: String,
  bank: String,
  to: String,
  appDate: String,
  status: String,
  remarks: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure you have a User model
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
