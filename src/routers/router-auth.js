import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
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
    readFileAsync
} from '../services/file';
import {
    validatorsPostAuth,
    validatorsPostAuthGoogle
} from '../validators/validators-auth';
import {
    renderErr
} from './helper';
import {
    OAuth2Client
} from 'google-auth-library'

const router = express.Router();
router.post('/v1/login', validatorsPostAuth, async (req, res, next) => {
    let {
        user_name,
        password
    } = req.body;
    let user = await User.findOne({
        user_name: user_name
    });
    let a = false;
    try {
        a = bcrypt.compareSync(password, user.password);
    } catch {
        return renderErr("Login", res, 403, "Incorrect username or password");
    }
    if (a) {
        let data = {
            id: user.id,
            name: user.name || "",
            type: user.type || null,
            list_department: user.list_department || [],
            image: user.student_info && user.student_info.image || ""
        };
        const cert = await readFileAsync(cfg('JWT_PRIVATE_KEY', String));
        const token = jwt.sign(data, cert, {
            algorithm: 'ES256'
        });
        try {
            await User.findByIdAndUpdate(user.id, {
                token_info: token
            })
        } catch (e) {
            return renderErr("Login", res, 500, "Update token");
        }
        res.status(200).send(Object.assign({
            token
        }, data));
    } else {
        return renderErr("Login", res, 403, "Incorrect username or password");
    }
    await next();
});

router.post('/v1/login-google', validatorsPostAuthGoogle, async (req, res, next) => {
    const client = new OAuth2Client(process.env.CLIENT_ID)
    let {
        token_id,
    } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token_id,
        audience: process.env.CLIENT_ID
    });
    if (!ticket) {
        return renderErr("Login google", res, 400, "token")
    }
    const { name, email, picture } = ticket.getPayload();
    let checkEmail = await User.findOne({ email: email });
    let user = null
    if (!checkEmail) {
        try {
            user = await User.create({
                name: name,
                email: email,
                student_info: {
                    faculty: '',
                    class_room: '',
                    image: picture || ""
                },
                type: User.TYPE_USER_STUDENT
            })
        } catch (error) {
            console.log(error)
            return renderErr("Login google", res, 500, "Create User")
        }
    } else {
        user = checkEmail
    }

    let data = {
        id: user.id,
        name: user.name || "",
        type: user.type || null,
        list_department: user.list_department || [],
        image: user.student_info && user.student_info.image || ""
    };
    const cert = await readFileAsync(cfg('JWT_PRIVATE_KEY', String));
    const token = jwt.sign(data, cert, {
        algorithm: 'ES256'
    });
    try {
        await User.findByIdAndUpdate(user.id, {
            token_info: token
        }, {})
    } catch (e) {
        return renderErr("Login", res, 500, "Update token");
    }
    res.status(200).send(Object.assign({
        token
    }, data));

    await next();
});

router.put('/v1/logout', verify_user_token, async (req, res, next) => {
    let user = res.state.user
    let data = await User.findById(user.id);
    if (!data) {
        return renderErr("Logout", res, 404, "user")
    }
    try {
        await User.findByIdAndUpdate(user.id, {
            token_info: ""
        });
    } catch (error) {
        return renderErr("Logout", res, 500, "Update User")
    }
    return res.status(200).send("Logout Successfully!")
});
export default router;