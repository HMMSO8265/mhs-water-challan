const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    isConnected = true;
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

const router = express.Router();

router.get('/challans', async (req, res) => {
    const records = await Challan.find().sort({ createdAt: -1 });
    res.json(records);
});

router.post('/challans', async (req, res) => {
    const record = new Challan(req.body);
    await record.save();
    res.status(201).json(record);
});

router.patch('/challans/:id', async (req, res) => {
    const record = await Challan.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
    res.json(record);
});

router.delete('/challans/:id', async (req, res) => {
    await Challan.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted' });
});

router.delete('/challans', async (req, res) => {
    await Challan.deleteMany({});
    res.json({ message: 'Wiped' });
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);