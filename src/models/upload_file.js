import mongoose, { Schema } from 'mongoose'

const UploadFile = mongoose.model("upload_files", Schema({
    path: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    status: {
        type: Number,
        default: 1
    },
    type: {
        type: String,
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

UploadFile.getOne = async (id) => {
    let data = await UploadFile.findById(id);
    return data
}

UploadFile.getList = async (where, paging) => {
    let data = await UploadFile.find();
    return data
}
export default UploadFile