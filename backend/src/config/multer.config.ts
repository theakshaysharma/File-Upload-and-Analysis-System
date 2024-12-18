import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads', // Upload directory, relative to project root
    filename: (req, file, cb) => {
      const fileName = Date.now() + extname(file.originalname); // Naming convention for uploaded files
      cb(null, fileName);
    },
  }),
};
