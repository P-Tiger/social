import moment from 'moment';
import multer from 'multer';
import { cfg } from '../config';
// Socket
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, cfg("DIR_UPLOAD", String))
    },
    filename: (req, file, cb) => {
        cb(null, `${moment().format('x')}_${file.originalname}`)
    }
})

let upload = multer({ storage: storage }).single("file")

export {
    upload
};
