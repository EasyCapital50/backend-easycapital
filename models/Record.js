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
  natureOfBsns: String,  
  styleOfBsns: String,   
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
