import mongoose, { Schema } from 'mongoose'

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

Post.getOne = async (id) => {
    let data = await Post.findById(id);
    return data
}

Post.getList = async (where, paging) => {
    let data = await Post.find();
    return data
}
export default Post