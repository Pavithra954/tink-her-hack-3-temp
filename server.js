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
app.get('/', (req, res)=> {
  res.status(200).json("hello world")
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Serve static files (like your HTML, CSS, and JS files)
app.use(express.static(path.join(__dirname, "public")));

// Default route to serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Schema for Donations
const donationSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  donationType: String,
  details: Object,
});

// Model for Donations
const Donation = mongoose.model("Donation", donationSchema);

// ** Test Route: Check Backend Connection **
app.get('/test', (req, res) => {
  res.send('Backend is working!');
});

// ** Test Route: Check Backend-to-Database Connection **
app.get('/test-db', async (req, res) => {
  try {
    const donations = await Donation.find(); // Fetch data from the database
    res.json(donations); // Send the data as a JSON response
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection failed.');
  }
});

// Route to handle form submission
app.post('/submit-donation', async (req, res) => {
  try {
    const { name, address, phone, donationType } = req.body;
    // Process the data or save it in the database
    res.status(200).json({ message: 'Donation received successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

