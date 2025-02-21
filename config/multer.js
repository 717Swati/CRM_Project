// config/multer.js
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/papers',
    filename: (req, file, cb) => {
        cb(null, `${req.user.id} - ${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Initialize upload
const upload = multer({
    storage,
    limits: { fileSize: 10000000 }, // 10MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    } else {
        cb('Error: PDFs Only!');
    }
}

module.exports = upload;