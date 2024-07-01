const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { Worker } = require('worker_threads');
const userRoutes = require('./routes/userRoutes');

const app = express();
const upload = multer({ dest: 'uploads' });

mongoose.connect('mongodb://localhost:27017/insurance_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/users', userRoutes);

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const collectionName = req.body.collectionName;

  const worker = new Worker(path.join(__dirname, 'workers/csvWorker.js'), {
    workerData: { filePath, collectionName },
  });

  worker.on('message', (message) => {
    if (message.status === 'done') {
      res.status(202).send({ message: 'File is being processed' });
    } else {
      res.status(500).send({ message: message.message });
    }
  });

  worker.on('error', (error) => {
    res.status(500).send({ message: error.message });
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      res.status(500).send({ message: `Worker stopped with exit code ${code}` });
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
