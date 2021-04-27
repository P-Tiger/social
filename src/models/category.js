import mongoose, { Schema } from 'mongoose'

const Category = mongoose.model("categories", Schema({
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

Category.getOne = async (id) => {
    let data = await Category.findById(id);
    return data
}

Category.getList = async (where, paging) => {
    let data = await Category.find();
    return data
}
export default Category