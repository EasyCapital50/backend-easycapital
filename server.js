require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const recordRoutes = require('./routes/recordRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors({
  origin: '*', // Allow all origins for simplicity, adjust as needed
  credentials: true, // Allow credentials if needed
}
  
));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ Mongo Error:', err));

app.use('/records', recordRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on ${PORT}`);
});
