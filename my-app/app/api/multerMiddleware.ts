// app/api/multerMiddleware.ts

import multer from 'multer';
import path from 'path';

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'public/uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

export const uploadMiddleware = (req: any, res: any) => {
    return new Promise((resolve, reject) => {
        upload.array('images', 10)(req, res, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(req);
        });
    });
};