export const fileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback(new Error('File is empty'), false);
    // allow images only 
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
}