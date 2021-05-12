import express from 'express';
import {
    verify_user_token
} from '../middlewares/jwt-verify';
import {
    Post
} from '../models';
import { paging, renderlogInfo } from './helper';

const router = express.Router();


router.get('/v1/posts', verify_user_token, async (req, res, next) => {
    let pager = paging(req.query)
    let data = await Post.getList({}, pager);
    return res.status(200).send(data);
});


router.post('/v1/posts', verify_user_token, async (req, res, next) => {
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
        data = await Post.create(dataInsert);
    } catch (error) {
        console.log(error);
        return renderErr("User Create", res, 500, "User Create");
    }
    res.send("Success")
});



router.put('/v1/posts-stt', verify_user_token, async (req, res, next) => {
    let user = res.state.user;
    let dataUpdate = {
        status: Post.STT_INACTIVE
    }
    if (!id) {
        return renderErr("Interaction Update Status", res, 400, "post_id", 2)
    }
    if (id) {
        let checkData = await Interaction.findById(id)
        if (!checkData) {
            return renderErr("Interaction Create", res, 404, "id")
        }
    }

    let data = null
    try {
        data = await Interaction.findByIdAndUpdate(id, dataUpdate);
    } catch (error) {
        console.log(error);
        return renderErr("Interaction Create", res, 500, "User Create");
    }
    res.send("Success")
});


export default router;