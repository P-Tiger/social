import mongoose, { Schema } from 'mongoose'

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

New.getOne = async (id) => {
    let data = await New.findById(id);
    return data
}

New.getList = async (where, paging) => {
    let data = await New.find().populate("creator", { _id: 1, name: 1 });
    return data
}
export default New