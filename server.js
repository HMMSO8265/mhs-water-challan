const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());

// Static Files Serve Karein (HTML, CSS, JS)
app.use(express.static(__dirname));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Aap ke baqi API routes (e.g. /api/challans) yahan rahenge...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());

// Static Files Serve Karein (HTML, CSS, JS)
app.use(express.static(__dirname));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Aap ke baqi API routes (e.g. /api/challans) yahan rahenge...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
















require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Updated Schema (Added 'status' field)
const ChallanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  isoDate: { type: String, required: true },
  timestamp: { type: String, required: true },
  operator: { type: String, required: true },
  phone: { type: String, required: true },
  item: { type: String, required: true },
  rate: { type: Number, required: true },
  quantity: { type: Number, required: true },
  debitNumeric: { type: Number, required: true },
  creditNumeric: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' } // Added status field
}, { timestamps: true });

const Challan = mongoose.model('Challan', ChallanSchema);

// 2. MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mubarak_user:Mubarak12345@cluster0.yp33qco.mongodb.net/mhs_water_db?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas Successfully'))
  .catch(err => console.error('❌ Connection Error:', err));

// API 1: Data Save (POST)
app.post('/api/challans', async (req, res) => {
  try {
    const newChallan = new Challan(req.body);
    await newChallan.save();
    res.status(201).json({ success: true, message: 'Data saved to MongoDB', data: newChallan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API 2: Fetch All Records (GET)
app.get('/api/challans', async (req, res) => {
  try {
    const records = await Challan.find().sort({ createdAt: -1 });
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API 3: Update Payment Credit or Status (PATCH)
app.patch('/api/challans/:id', async (req, res) => {
  try {
    const updated = await Challan.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API 4: Delete Single Record (DELETE)
app.delete('/api/challans/:id', async (req, res) => {
  try {
    await Challan.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API 5: Wipe All Records (DELETE ALL)
app.delete('/api/challans', async (req, res) => {
  try {
    await Challan.deleteMany({});
    res.json({ success: true, message: 'All records wiped successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));