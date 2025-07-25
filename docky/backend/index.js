const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage });

let submissions = [];

app.post('/api/posts', upload.single('media'), (req, res) => {
  const { username } = req.body;
  if (!username || !req.file) {
    return res.status(400).json({ error: 'Name and document are required.' });
  }
  const submission = {
    id: submissions.length + 1,
    username,
    media_url: `/uploads/${req.file.filename}`,
    created_at: new Date().toISOString()
  };
  submissions.push(submission);
  res.status(201).json({ message: 'Submission successful.' });
});

app.get('/api/posts', (req, res) => {
  res.json(submissions);
});

app.listen(PORT, () => {
  if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
  console.log(`Backend running on http://localhost:${PORT}`);
}); 