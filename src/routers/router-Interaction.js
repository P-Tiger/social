import express from 'express';
import {
    verify_user_token
} from '../middlewares/jwt-verify';
import {
    Interaction, Post
} from '../models';
import { paging, renderErr, renderlogInfo } from './helper';

const router = express.Router();


router.get('/v1/interactions', verify_user_token, async (req, res, next) => {
    let {
        post_ids
    } = req.query
    let where = {
        status: Interaction.STT_ACTIVE
    }
    let pager = paging(req.query)
    if (post_ids) {
        try {
            post_ids = JSON.parse(post_ids)
        } catch (error) {
            console.log(error)
            return res.status(200).send({
                total: 0,
                data: []
            })
        }
        where.post_id = {
            $in: post_ids
        }
    }
    let data = await Interaction.getList(where, pager);
    return res.status(200).send(data);
});


router.post('/v1/interactions', verify_user_token, async (req, res, next) => {
    let user = res.state.user;
    let {
        comment,
        post_id
    } = req.body
    let dataInsert = {
        creator: user.id,
        post_id: post_id || null,
        logs: {
            list: [renderlogInfo(1, "user", user)]
        }
    }
    if (!post_id) {
        return renderErr("Interaction Create", res, 400, "post_id", 2)
    }
    if (post_id) {
        let checkData = await Post.findById(post_id)
        if (!checkData) {
            return renderErr("Interaction Create", res, 404, "post_id")
        }
    }
    if (comment) {
        dataInsert.comment = comment
    }
    let data = null
    try {
        data = await Interaction.create(dataInsert);
    } catch (error) {
        console.log(error);
        return renderErr("Interaction Create", res, 500, "User Create");
    }
    res.send("Success")
});


router.put('/v1/interactions-stt', verify_user_token, async (req, res, next) => {
    let user = res.state.user;
    let {
        id
    } = req.body
    let dataUpdate = {
        status: Interaction.STT_INACTIVE
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
    data = await Interaction.findById(data.id)
    return res.status(200).send(data)
});




export default router;