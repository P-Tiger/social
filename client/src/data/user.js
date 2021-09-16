import Axios from 'axios'
import {
    GetToken
} from '../configs'
async function userPost(dataPost) {
    let data = await Axios.post(process.env.REACT_APP_API_URL + "/users", dataPost, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}

async function userDetail(id) {
    let data = await Axios.get(process.env.REACT_APP_API_URL + "/users/" + id, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}


async function userUpdate(dataUpdate) {
    let data = await Axios.put(process.env.REACT_APP_API_URL + "/users", dataUpdate, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}



export {
    userPost,
    userDetail,
    userUpdate
}