import express from 'express';
import {
    verify_user_token
} from '../middlewares/jwt-verify';
import {
    Department,
    New, User
} from '../models';
import {
    paging,
    renderErr,
    renderlogInfo
} from './helper';

const router = express.Router();


router.get('/v1/news', verify_user_token, async (req, res, next) => {
    let {
        department
    } = req.query
    let where = {
        status: New.STT_ACTIVE
    }
    let pager = paging(req.query)
    if (department) {
        where.department = department
    }

    let data = await New.getList(where, pager);
    return res.status(200).send(data);
});


router.get('/v1/news/:id', verify_user_token, async (req, res, next) => {
    let id = req.params.id;
    let data = await New.findById(id).populate([{
        path: 'creator',
        model: User,
        select: 'id name'
    }, {
        path: 'department',
        model: Department,
        select: 'id name'
    }])
    if (!data) {
        return renderErr("News Detail", res, 404, "id")
    }
    return res.status(200).send(data);
});



router.post('/v1/news', verify_user_token, async (req, res, next) => {
    let user = res.state.user;
    let data = null
    let {
        title,
        content,
        department
    } = req.body
    let dataInsert = {
        creator: user.id,
        department: department,
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

router.put('/v1/news', verify_user_token, async (req, res, next) => {
    let user = res.state.user;
    let {
        id,
        content,
        title
    } = req.body;
    let dataUpdate = {}
    if (content) {
        dataUpdate.content = content
    }
    if (title) {
        dataUpdate.title = title
    }
    let data = null
    try {
        data = await New.findByIdAndUpdate(id, dataUpdate);
    } catch (error) {
        console.log(error);
        return renderErr("New Edit", res, 500, "Edit New");
    }
    data = await New.findById(id)
    return res.status(200).send(data)
});

router.put('/v1/news-status', verify_user_token, async (req, res, next) => {
    let user = res.state.user;
    let {
        id
    } = req.body
    let dataUpdate = {
        id: id,
        status: New.STT_INACTIVE
    }
    let data = null
    try {
        data = await New.findByIdAndUpdate(id, dataUpdate);
    } catch (error) {
        console.log(error);
        return renderErr("New Edit", res, 500, "Edit New");
    }
    data = await New.findById(id).populate([{
        path: 'creator',
        model: User,
        select: 'id name'
    }, {
        path: 'department',
        model: Department,
        select: 'id name'
    }])
    return res.status(200).send(data)
});



export default router;