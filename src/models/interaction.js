import mongoose, { Schema } from 'mongoose'

const Interaction = mongoose.model("interactions", Schema({
    type: {
        type: Number,
        default: 1
    },
    status: {
        type: Number,
        default: 1
    },
    comment: {
        type: String,
        require: true
    },
    liker: {
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

Interaction.getOne = async (id) => {
    let data = await Interaction.findById(id);
    return data
}

Interaction.getList = async (where, paging) => {
    let data = await Interaction.find();
    return data
}
export default Interaction