import mongoose, { Schema } from 'mongoose'

const User = mongoose.model("users", Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: Number,
        default: 1
    },
    status: {
        type: Number,
        default: 1
    },
    user_name: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        trim: true,
        default: null
    },
    password: {
        type: String,
        trim: true,
    },
    student_info: {
        faculty: {
            type: String,
            default: ''
        },
        class_room: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: ''
        }
    },
    token_info: {
        type: String,
        required: false,
    },
    list_department: [{
        type: Schema.Types.ObjectId,
        ref: 'departments'
    }],
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

User.TYPE_USER_ADMIN = 1
User.TYPE_USER_DEPARTMENT = 2
User.TYPE_USER_STUDENT = 3


User.getList = async (where, paging) => {
    let data = await User.find().select("-logs").populate("list_department", { _id: 1, name: 1 });
    return {
        total: data.length,
        data: data
    }
}
export default User