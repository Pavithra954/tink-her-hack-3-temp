const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ourhood", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

const donationSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  donationType: String,
  details: Object, // Optional, based on your form
});

const Donation = mongoose.model("Donation", donationSchema);
// Route to handle form submission
app.post('/submit-donation', async (req, res) => {
  try {
    console.log("Incoming Data:", req.body); // Debugging form data
    const { name, address, phone, donationType } = req.body;
    await Donation.create({ name, address, phone, donationType });
    res.send('Donation saved successfully!');
  } catch (error) {
    console.error('Error saving donation:', error);
    res.status(500).send('Error saving donation.'); 
  }
});
app.get('/donations/:type', async (req, res) => {
  try {
    const donationType = req.params.type; // Get the type (e.g., "books") from the URL
    const donations = await Donation.find({ donationType }); // Fetch matching donations
    res.status(200).json(donations); // Send donations as JSON response
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Error fetching donations.' });
  }
});


// Test Route
app.get('/test', (req, res) => {
  res.send('Backend is working!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
