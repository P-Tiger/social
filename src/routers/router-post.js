import express from 'express';
import {
    verify_user_token
} from '../middlewares/jwt-verify';
import {
    Post, User
} from '../models';
import { paging, renderlogInfo } from './helper';

const router = express.Router();


router.get('/v1/posts', verify_user_token, async (req, res, next) => {
    console.log(req.query)
    let pager = paging(req.query)
    let where = {
        status: Post.STT_ACTIVE
    }
    let data = await Post.getList(where, pager);
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
    data = await Post.findById(data.id).
        populate([{
            path: 'creator',
            model: User,
            select: 'id name student_info'
        }])
    return res.send(data)
});

router.put('/v1/posts', verify_user_token, async (req, res, next) => {
    let user = res.state.user;
    let data = null
    let {
        title,
        content,
        id
    } = req.body
    let dataUpdate = {}
    if (!id) {
        return renderErr("Interaction Update Status", res, 400, "post_id", 2)
    }
    if (id) {
        let checkData = await Post.findById(id)
        if (!checkData) {
            return renderErr("Post Create", res, 404, "id")
        }
    }
    if (title) {
        dataUpdate.title = title
    }
    if (content) {
        dataUpdate.content = content
    }
    try {
        data = await Post.findByIdAndUpdate(id, dataUpdate);
    } catch (error) {
        console.log(error);
        return renderErr("User Create", res, 500, "User Create");
    }
    data = await Post.findById(data.id).
        populate([{
            path: 'creator',
            model: User,
            select: 'id name student_info'
        }])
    return res.send(data)
});


router.put('/v1/posts-stt', verify_user_token, async (req, res, next) => {
    let user = res.state.user;
    let dataUpdate = {
        status: Post.STT_INACTIVE
    }
    let {
        id
    } = req.body
    if (!id) {
        return renderErr("Interaction Update Status", res, 400, "post_id", 2)
    }
    if (id) {
        let checkData = await Post.findById(id)
        if (!checkData) {
            return renderErr("Post Create", res, 404, "id")
        }
    }

    let data = null
    try {
        data = await Post.findByIdAndUpdate(id, dataUpdate);
    } catch (error) {
        console.log(error);
        return renderErr("Interaction Create", res, 500, "User Create");
    }
    data = await Post.findById(data.id).
        populate([{
            path: 'creator',
            model: User,
            select: 'id name student_info'
        }]);
    return res.status(200).send(data)
});


export default router;