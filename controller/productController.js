import { product } from "../models/index.js";
import multer from "multer";
import path from 'path';
import customErrorHandler from "../services/customErrorHandler.js";


// setting up for configuration for 'multer'
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.
            originalname)}`;
        // eg :- 1697531761599-573835012.png
        cb(null, uniqueName);
    }
})

// Middlewares for multer
const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single('image') // limit is 5 mb

// handles the storing of products
const productController = {
    async store(req, res, next) {
        // multipart form data

        handleMultipartData(req, res, (err) => {
            if (err) {
                return next(customErrorHandler.serverError(err.message));
            }
            // console.log(req.file);
            const filePath = req.file.path();
            res.json({});
        })
    }
}
export default productController;