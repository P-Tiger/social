import express from 'express';
import {
    verify_user_token
} from '../middlewares/jwt-verify';
import {
    Department
} from '../models';

const router = express.Router();


router.get('/v1/departments', verify_user_token, async (req, res, next) => {
    let data = await Department.getList({}, {});
    return res.status(200).send(data);
});


router.post('/v1/departments', async (req, res, next) => {
    let data = null
    let {
        name
    } = req.body
    let dataInsert = {}
    if (name) {
        dataInsert.name = name
    }
    try {
        data = await Department.create(dataInsert);
    } catch (error) {
        console.log(error);
        return renderErr("User Create", res, 500, "User Create");
    }
    res.send(data)
});


export default router;