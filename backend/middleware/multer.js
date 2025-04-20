const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png',
    'application/pdf',
    'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp3', 'audio/webm'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and audios are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
