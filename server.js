 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json()); // Taki server data nu samajh sake
app.use(cors());         // Taki HTML file server naal gal kar sake

// 1. MongoDB Naal Connection
mongoose.connect('mongodb://127.0.0.1:27017/rhkkp_talent_show')
  .then(() => console.log("✅ Mubarak ho! MongoDB jud gya hai."))
  .catch(err => console.error("❌ Connection nahi hoya:", err));

// 2. Data kive save hove (Schema)
const registrationSchema = new mongoose.Schema({
  name: String,
  category: String,
  timestamp: { type: Date, default: Date.now }
});

// 3. Model tyaar karo
const Registration = mongoose.model('Registration', registrationSchema);

// 4. Registration API (Data save karan layi rasta)
app.post('/save-data', async (req, res) => {
  try {
    const newData = new Registration(req.body);
    await newData.save();
    res.status(200).send({ message: "✅ Data MongoDB vich save ho gya!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "❌ Galti ho gayi!" });
  }
});

// 5. Server nu on karan layi
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server port ${PORT} te chal reha hai!`);
});