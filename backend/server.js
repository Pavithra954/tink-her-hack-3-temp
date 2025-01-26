const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

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

// Route to handle form submission
app.post("/submit-donation", async (req, res) => {
  const donationData = req.body;

  try {
    const newDonation = new Donation(donationData);
    await newDonation.save();
    res.status(200).send("Donation saved to MongoDB!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving donation to database");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
