const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const exifRoutes = require('./routes/exif');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(limiter);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and JPG files are allowed'), false);
    }
  }
});

// Routes
app.use('/api/exif', exifRoutes(upload));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'GeoImgr Backend is running' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Clean up uploaded files older than 1 hour
const cleanupOldFiles = () => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return;
    
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        
        if (now - stats.mtime.getTime() > oneHour) {
          fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
            else console.log('Deleted old file:', file);
          });
        }
      });
    });
  });
};

// Clean up old files every 30 minutes
setInterval(cleanupOldFiles, 30 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`🚀 GeoImgr backend server is running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
}); 