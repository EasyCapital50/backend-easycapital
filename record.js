require("dotenv").config();
const mongoose = require('mongoose');
const Record = require('./models/Record');
const User = require('./models/User');

const runMigration = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Find all records missing company
  const records = await Record.find({ company: { $exists: false } });

  for (const rec of records) {
    const user = await User.findById(rec.createdBy);
    if (user && user.company) {
      rec.company = user.company;
      await rec.save();
      console.log(`✅ Updated record ${rec._id} with company ${user.company}`);
    } else {
      console.log(`⚠️ Record ${rec._id} could not be linked (no company found)`);
    }
  }

  console.log('Migration complete');
  process.exit();
};

runMigration();
