import express from 'express';
import {
    verify_user_token
} from '../middlewares/jwt-verify';
import {
    Category
} from '../models';

const router = express.Router();


router.get('/v1/categories', verify_user_token, async (req, res, next) => {
    let data = await Category.getList({}, {});
    return res.status(200).send(data);
});


router.post('/v1/categories', verify_user_token, async (req, res, next) => {
    let data = null
    let {
        name
    } = req.body
    let dataInsert = {}
    if (name) {
        dataInsert.name = name
    }
    try {
        data = await Category.create(dataInsert);
    } catch (error) {
        console.log(error);
        return renderErr("User Create", res, 500, "User Create");
    }
    res.send(data)
});


export default router;