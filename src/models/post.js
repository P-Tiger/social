import mongoose, { Schema } from 'mongoose'
import { User } from '.'

const Post = mongoose.model("posts", Schema({
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
    },
    content: {
        type: String,
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

Post.STT_ACTIVE = 1
Post.STT_INACTIVE = -1

Post.getOne = async (id) => {
    let data = await Post.findById(id);
    return data
}

Post.getList = async (where, paging) => {
    let data = await Post.find(where).limit(paging.limit).skip(paging.offset).sort([["createdAt", -1]]).
        populate([{
            path: 'creator',
            model: User,
            select: 'id name student_info'
        }])

    let count = await Post.countDocuments(where)
    return {
        total: count,
        data: data
    }
}
export default Post