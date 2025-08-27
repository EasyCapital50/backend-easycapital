const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // main admin
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
