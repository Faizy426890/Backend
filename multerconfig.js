import multer from 'multer';

// Initialize in-memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
