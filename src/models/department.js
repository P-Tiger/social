import mongoose, { Schema } from 'mongoose'

const Department = mongoose.model("departments", Schema({
    type: {
        type: Number,
        default: 1
    },
    status: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        require: true
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

Department.getOne = async (id) => {
    let data = await Department.findById(id);
    return data
}

Department.getList = async (where, paging) => {
    let data = await Department.find();
    return data
}
export default Department