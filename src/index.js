import bodyParser from 'body-parser';
import express from 'express';
import {
    createServer
} from "http";
import path from 'path';
import {
    Server
} from "socket.io";
import {
    cfg
} from './config';
import routeLog from './middlewares/route-log';
import whiteListOrigin from './middlewares/white-list-origin';
import { Department, New, User } from './models';

// import {
//     Chat
// } from './models';
import routers from './routers';
import {
    renderErr, renderlogInfo
} from './routers/helper';
const app = express();
app
    .use(whiteListOrigin)
    .use(routeLog)
    .use("/v1/" + cfg("DIR_UPLOAD", String), express.static(path.join(__dirname, 'uploads')))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(routers)
// Socket

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true,
    },
    allowEIO3: true
});

io.on("connection", (socket) => {
    console.log("connection");
    socket.on("Create News", async msg => {
        let {
            title,
            content,
            department,
            user,
        } = msg
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
        let data = null;
        try {
            data = await New.create(dataInsert);
            await data.save();
        } catch (error) {
            console.log(error);
            return renderErr("User Create", res, 500, "User Create");
        }
        let dataList = await New.find({ status: 1 }).limit(10).skip(0).sort([["createdAt", -1]]).populate([{
            path: 'creator',
            model: User,
            select: 'id name'
        }, {
            path: 'department',
            model: Department,
            select: 'id name'
        }])
        let count = await New.countDocuments({ status: 1 })
        let dataReturn = {
            total: count,
            data: dataList
        }
        data = await New.findById(data.id).populate([{
            path: 'creator',
            model: User,
            select: 'id name'
        }, {
            path: 'department',
            model: Department,
            select: 'id name'
        }])
        return io.emit("Output Create", { dataList: dataReturn, data: data });
    })
    socket.on('User is disconnect', (data) => {
        console.log('disconnect: ', socket.rooms);
    });
})

httpServer.listen(cfg('APP_PORT', parseInt), cfg('APP_HOST', String));
console.info(`API Server started at http://%s:%d`, cfg('APP_HOST', String), cfg('APP_PORT', parseInt));

