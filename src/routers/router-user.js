import bcrypt from 'bcrypt';
import express from 'express';
import _ from 'lodash';
import {
    cfg
} from '../config';
import {
    verify_user_token
} from '../middlewares/jwt-verify';
import {
    User
} from '../models';
import {
    validatorsDetailUser,
    validatorsPostUser,
    validatorsPutPasswordMe,
    validatorsPutUser
} from '../validators/validators-user';
import {
    renderErr,
    renderlogInfo
} from './helper';

const router = express.Router();


router.get('/v1/users', verify_user_token, async (req, res, next) => {
    let data = await User.getList({}, {});
    return res.status(200).send(data);
});

router.post('/v1/users', verify_user_token, validatorsPostUser, async (req, res, next) => {
    let user = res.state.user
    let {
        user_name,
        password,
        name,
        list_department,
        type
    } = req.body;
    let dataInsert = {
        password: bcrypt.hashSync(password, cfg("BCRYPT_SALT_ROUNDS", parseInt)),
        user_name: user_name,
        name: name,
        token_info: "",
        list_department: list_department || [],
        type: type,
        logs: {
            list: [renderlogInfo(1, "user", user)]
        }
    }
    if (type === User.TYPE_USER_DEPARTMENT) {
        if (!list_department) {
            return renderErr("User Create", res, 400, "list_department", 2)
        }
    }
    if (user_name) {
        let checkData = await User.findOne({
            user_name: user_name
        })
        if (checkData) {
            return renderErr("User Create", res, 409, "user_name");
        }
    }
    let data = null
    try {
        data = await User.create(dataInsert);
    } catch (error) {
        console.log(error);
        return renderErr("User Create", res, 500, "User Create");
    }
    data = await User.findById(data.id)
    return res.status(200).send(data)
});

router.get('/v1/users/:id', verify_user_token, async (req, res, next) => {
    let id = req.params.id
    let data = await User.findById(id);
    return res.status(200).send(data);
});

router.put('/v1/users', verify_user_token, validatorsPutUser, async (req, res, next) => {
    let user = res.state.user
    let data = await User.findById(user.id);
    if (!data) {
        return renderErr("Update User", res, 404, "id")
    }
    if (!_.includes([User.TYPE_USER_DEPARTMENT, User.TYPE_USER_STUDENT], data.type)) {
        return renderErr("Update User", res, 403, "type")
    }
    let {
        name,
        image,
        faculty,
        class_room,
        password
    } = req.body;

    let dataUpdate = {}
    let logs = data.logs || {}
    let listLogs = logs.list || []
    let studentInfo = data.student_info || {}

    if (data.type === User.TYPE_USER_STUDENT) {
        if (name) {
            listLogs.push(renderlogInfo("edit", "user", user, "name", data.name || '', name))
            dataUpdate.name = name;
        }
        if (image) {
            listLogs.push(renderlogInfo("edit", "user", user, "image", dataUpdate.image || '', image))
            studentInfo.image = image;
        }
        if (faculty) {
            listLogs.push(renderlogInfo("edit", "user", user, "faculty", studentInfo.faculty || '', faculty))
            studentInfo.faculty = faculty;
        }
        if (class_room) {
            listLogs.push(renderlogInfo("edit", "user", user, "class_room", studentInfo.class_room || '', class_room))
            studentInfo.class_room = class_room;
        }
    } else {
        if (password) {
            dataUpdate.password = bcrypt.hashSync(password, cfg("BCRYPT_SALT_ROUNDS", parseInt))
            dataUpdate.token_info = ""
        }
    }
    logs.list = listLogs
    dataUpdate.logs = logs
    dataUpdate.student_info = studentInfo
    try {
        await User.findByIdAndUpdate(user.id, dataUpdate);
    } catch (error) {
        console.log(error);
        return renderErr("User Update Password", res, 500, "User Password Update");
    }
    data = await User.findById(user.id)
    return res.status(200).send(data)
});

router.put('/v1/users-password/me', verify_user_token, validatorsPutPasswordMe, async (req, res, next) => {
    let user = res.state.user;
    let {
        password,
    } = req.body;
    let dataUpdate = {
        password: bcrypt.hashSync(password, cfg("BCRYPT_SALT_ROUNDS", parseInt)),
    }
    let data = null
    try {
        data = await User.findByIdAndUpdate(user.id, dataUpdate);
    } catch (error) {
        console.log(error);
        return renderErr("User Update Password", res, 500, "User Password Update");
    }
    return res.status(200).send(data)
});

router.put('/v1/reset-password/id', verify_user_token, validatorsDetailUser, async (req, res, next) => {
    let id = req.params.id;
    let data = await User.findById(id);
    if (!data) {
        return renderErr("Update Password", res, 404, "id")
    }
    let dataUpdate = {
        password: bcrypt.hashSync(cfg("RESET_PASSWORD", String), cfg("BCRYPT_SALT_ROUNDS", parseInt)),
    }
    try {
        data.update(dataUpdate);
    } catch (error) {
        console.log(error);
        return renderErr("User Update Password", res, 500, "User Password Update");
    }
    return res.status(200).send(data)
});



export default router;