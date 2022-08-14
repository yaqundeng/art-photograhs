import AWS from 'aws-sdk';
import dotenv from "dotenv";
import multer from 'multer';
import multerS3 from 'multer-s3-v2';
import path from 'path';



dotenv.config();
export const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_KEY_ID,
    secretAccessKey: process.env.AWS_S3_KEY,
    region: process.env.AWS_REGION
});

const upload = multer({
    // CREATE MULTER-S3 FUNCTION FOR STORAGE
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // META DATA FOR PUTTING FIELD NAME
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        // SET / MODIFY ORIGINAL FILE NAME
        key: function(req, file, cb) {
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    }),
    // SET DEFAULT FILE SIZE UPLOAD LIMIT
    limits: { fileSize: 1024 * 1024 * 10 }, // 50MB
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Allow images only of extensions jpeg|jpg|png !");
        }
    }
});


export default upload;