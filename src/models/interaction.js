import mongoose, { Schema } from 'mongoose'
import { User } from '.'

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
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'posts'
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

Interaction.TYPE_COMMENT = 1
Interaction.STT_ACTIVE = 1
Interaction.STT_INACTIVE = -1

Interaction.getOne = async (id) => {
    let data = await Interaction.findById(id);
    return data
}

Interaction.getList = async (where, paging) => {
    let data = await Interaction.find(where).sort([["createdAt", 1]]).
        populate([{
            path: 'creator',
            model: User,
            select: 'id name student_info'
        }])
    let count = await Interaction.countDocuments(where)
    return {
        total: count,
        data: data
    }
}
export default Interaction