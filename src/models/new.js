import mongoose, { Schema } from 'mongoose'
import { Department, User } from '.';

const New = mongoose.model("news", Schema({
    type: {
        type: Number,
        default: 1
    },
    status: {
        type: Number,
        default: 1
    },
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'department'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    logs: {
        list: {
            type: Array,
            default: []
        }
    },
    meta: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
}))

New.STT_ACTIVE = 1
New.STT_INACTIVE = -1

New.getOne = async (id) => {
    let data = await New.findById(id);
    return data
}

New.getList = async (where, paging) => {
    let data = await New.find(where).limit(paging.limit).skip(paging.offset).sort([["createdAt", -1]]).populate([{
        path: 'creator',
        model: User,
        select: 'id name'
    }, {
        path: 'department',
        model: Department,
        select: 'id name'
    }])
    let count = await New.countDocuments(where)
    return {
        total: count,
        data: data
    }
}
export default New