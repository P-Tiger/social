import express from 'express';
import {
    verify_user_token
} from '../middlewares/jwt-verify';
import {
    upload
} from '../controllers/controller-multers'
import {
    renderErr
} from './helper';
import {
    UploadFile
} from '../models';

const router = express.Router();


router.post('/v1/uploads', verify_user_token, async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log("error: ", err)
            return renderErr("Upload File", res, 500, "File Update")
        }
        let data = null
        try {
            data = await UploadFile.create({
                name: res.req.file.originalname,
                path: res.req.file.path,
                type: res.req.file.mimetype
            })
        } catch (error) {
            console.log(error);
            return renderErr("Upload File", res, 500, "File Update")
        }
        return res.status(200).send(data)
    })
});

router.get('/v1/uploads/:id', async (req, res, next) => {
    let id = req.params.id
    let data = await UploadFile.findById(id);
    if (!data) {
        return renderErr("Get File", res, 404, "id")
    }
    return res.sendfile(data.path)

});
export default router;