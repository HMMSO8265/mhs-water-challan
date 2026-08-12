const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://user:password@cluster.mongodb.net/dbname";
mongoose.connect(MONGO_URI).catch(err => console.error(err));

// Aap ke saare Express API routes (jaise server.js me hain) yahan likhein:
// Example:
// app.post('/api/challans', ...);
// app.get('/api/challans', ...);

module.exports.handler = serverless(app);