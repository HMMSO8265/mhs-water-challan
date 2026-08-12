require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Schema
const ChallanSchema = new mongoose.Schema({
  id: { type: String, required: true },
  isoDate: { type: String, required: true },
  timestamp: { type: String, required: true },
  operator: { type: String, required: true },
  phone: { type: String, required: true },
  item: { type: String, required: true },
  rate: { type: Number, required: true },
  quantity: { type: Number, required: true },
  debitNumeric: { type: Number, required: true },
  creditNumeric: { type: Number, default: 0 }
}, { timestamps: true });

const Challan = mongoose.model('Challan', ChallanSchema);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://mubarak_user:Mubarak12345@cluster0.yp33qco.mongodb.net/mhs_water_db?appName=Cluster0")
  .then(() => console.log('✅ Connected to MongoDB Atlas Successfully'))
  .catch(err => console.error('❌ Connection Error:', err));

// API 1: Data Save karne ke liye
app.post('/api/challans', async (req, res) => {
  try {
    const newChallan = new Challan(req.body);
    await newChallan.save();
    res.status(201).json({ success: true, message: 'Data saved to MongoDB', data: newChallan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API 2: Admin Dashboard par Data dikhane ke liye
app.get('/api/challans', async (req, res) => {
  try {
    const records = await Challan.find().sort({ createdAt: -1 });
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));