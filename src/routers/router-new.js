import express from 'express';
import {
    verify_user_token
} from '../middlewares/jwt-verify';
import {
    New
} from '../models';
import {
    renderlogInfo
} from './helper';

const router = express.Router();


router.get('/v1/news', verify_user_token, async (req, res, next) => {
    let data = await New.getList({}, {});
    return res.status(200).send(data);
});


router.post('/v1/news', verify_user_token, async (req, res, next) => {
    let user = res.state.user;
    let data = null
    let {
        title,
        content
    } = req.body
    let dataInsert = {
        creator: user.id,
        logs: {
            list: [renderlogInfo(1, "user", user)]
        }
    }
    if (title) {
        dataInsert.title = title
    }
    if (content) {
        dataInsert.content = content
    }
    try {
        data = await New.create(dataInsert);
    } catch (error) {
        console.log(error);
        return renderErr("User Create", res, 500, "User Create");
    }
    res.send(data)
});


export default router;