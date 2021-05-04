import express from 'express';
import {
    verify_user_token
} from '../middlewares/jwt-verify';
import {
    Chat, User
} from '../models';
import {
    Department
} from '../models';

const router = express.Router();


router.get('/v1/chats', verify_user_token, async (req, res, next) => {
    let data = await Chat.getList({}, {});
    return res.status(200).send(data);
});


// router.get('/v1/departments', async (req, res, next) => {
//     let data = null
//     try {
//         data = await Department.create({
//             name: "Ho 2"
//         });
//     } catch (error) {
//         console.log(error);
//         return renderErr("User Create", res, 500, "User Create");
//     }
//     res.send("Success")
// });

// router.get('/v1/users', async (req, res, next) => {
//     let data = null
//     try {
//         data = await User.create({
//             name: "aaaa",
//             user_name: "aaa",
//             password: "aaaa",
//             list_department: ["60882e8f3fd0ab5344f2b185", "60882e4ddbab2f530ff154d0"]
//         });
//     } catch (error) {
//         console.log(error);
//         return renderErr("User Create", res, 500, "User Create");
//     }
//     res.send("Success")
// });



export default router;