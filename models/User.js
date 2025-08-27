const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['mainadmin', 'superadmin', 'staff', 'user'], 
    default: 'user' 
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null } 
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.index({ username: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
