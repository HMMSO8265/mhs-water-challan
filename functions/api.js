require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Schema
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
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

const Challan = mongoose.models.Challan || mongoose.model('Challan', ChallanSchema);

// MongoDB Connection Helper
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mubarak_user:Mubarak12345@cluster0.yp33qco.mongodb.net/mhs_water_db?appName=Cluster0";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGO_URI);
};

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: "Database connection failed" });
  }
});

// API Routes
app.post('/api/challans', async (req, res) => {
  try {
    const newChallan = new Challan(req.body);
    await newChallan.save();
    res.status(201).json({ success: true, message: 'Data saved to MongoDB', data: newChallan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/challans', async (req, res) => {
  try {
    const records = await Challan.find().sort({ createdAt: -1 });
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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

app.delete('/api/challans/:id', async (req, res) => {
  try {
    await Challan.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/challans', async (req, res) => {
  try {
    await Challan.deleteMany({});
    res.json({ success: true, message: 'All records wiped successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports.handler = serverless(app);