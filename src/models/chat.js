import mongoose, { Schema } from 'mongoose'

const Chat = mongoose.model("chats", Schema({
    message: {
        type: String
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    type: {
        type: String
    },
}, {
    timestamps: true
}))
Chat.getList = async (where, paging) => {
    let data = await Chat.find().sort({ createdAt: 1 }).populate("sender", { password: 0, token_info: 0 });
    return data
}
export default Chat