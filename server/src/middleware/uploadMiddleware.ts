import multer from 'multer';
import ApiError from '../utils/ApiError';

// Use MemoryStorage so the file is available as a Buffer
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check MIME type OR extension fallback
  const isImageMime = file.mimetype.startsWith('image/');
  const isImageExt = /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file.originalname);

  if (isImageMime || isImageExt) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files are allowed!'));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
