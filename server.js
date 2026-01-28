 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // Nava: File upload layi
const fs = require('fs');         // Nava: Folder check karan layi

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static('public')); 
app.use('/songs', express.static('uploads/songs')); // Nava: Gaanya nu public access den layi

// --- NAVA: MP3 UPLOAD SETUP ---
const uploadDir = './uploads/songs';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, uploadDir); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });
// ------------------------------

// 1. Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/rhkkp_show')
  .then(() => console.log("✅ Database Connected Successfully!"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// 2. Data Models (User te Candidate)
const userSchema = new mongoose.Schema({
  name: String, email: String, phone: String, city: String, age: Number,
  category: String, userCode: String, profilePic: String,
  gifts: { type: Number, default: 0 },
  verified: { type: Boolean, default: false }
});

const candidateSchema = new mongoose.Schema({
  name: String, 
  photo: String, 
  videoUrl: String,
  votes: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [{ userName: String, text: String, time: { type: Date, default: Date.now } }]
});

// Nava Model: MP3 Songs layi
const songSchema = new mongoose.Schema({
    title: String,
    fileName: String,
    uploadDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Candidate = mongoose.model('Candidate', candidateSchema);
const Song = mongoose.model('Song', songSchema); // Nava Model

// 3. Like Button API
app.post('/api/like/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        res.send({ message: "Liked!", likes: candidate.likes });
    } catch (err) { res.status(500).send(err); }
});

// 4. Abuse Filter & Comment System
const badWords = ["abuse1", "nude", "sex", "badword1"]; 
app.post('/add-comment', async (req, res) => {
    const { candId, userName, text } = req.body;
    let isClean = !badWords.some(word => text.toLowerCase().includes(word));
    if(!isClean) return res.status(400).send({ message: "Abusive language not allowed!" });
    try {
        await Candidate.findByIdAndUpdate(candId, { $push: { comments: { userName, text } } });
        res.send({ message: "Comment added!" });
    } catch (err) { res.status(500).send(err); }
});

// 5. Admin Power: Candidate Manage
app.post('/admin/manage-candidate', async (req, res) => {
    const { id, name, votes } = req.body;
    await Candidate.findByIdAndUpdate(id, { name, votes });
    res.send({ message: "Admin: Data Updated!" });
});

// 6. NAVA: Admin Power - MP3 Upload API
app.post('/admin/upload-song', upload.single('songFile'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send({ message: "File nahi mili!" });
        
        const nawaSong = new Song({
            title: req.body.title || req.file.originalname,
            fileName: req.file.filename
        });
        await nawaSong.save(); 
        res.send({ message: "Song Uploaded & Saved to DB!", song: nawaSong });
    } catch (err) { res.status(500).send(err); }
});

// 7. API: Saare gaane get karan layi (index.html layi)
app.get('/api/songs', async (req, res) => {
    const songs = await Song.find().sort({ uploadDate: -1 });
    res.json(songs);
});

// Server Start
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
});