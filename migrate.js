require("dotenv").config();
const mongoose = require("mongoose");
const Company = require("./models/Company");
const User = require("./models/User");

(async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 2. Create a company for your existing single-company setup
    const companyName = "Easy Capital"; // change if you want another name
    let company = await Company.findOne({ name: companyName });

    if (!company) {
      company = await Company.create({
        name: companyName,
        createdBy: null, // you can set a mainadmin's _id later if you have one
      });
      console.log(`🏢 Company created: ${company.name}`);
    } else {
      console.log(`🏢 Company already exists: ${company.name}`);
    }

    // 3. Update all existing users who don’t have a company
    const result = await User.updateMany(
      { company: null }, 
      { $set: { company: company._id } }
    );

    console.log(`👥 Users updated: ${result.modifiedCount}`);

    // 4. Done
    console.log("🎉 Migration completed successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
})();
