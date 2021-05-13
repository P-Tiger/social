import Axios from 'axios'
import {
    GetToken
} from '../configs'
async function postsPost(dataPost) {
    let data = await Axios.post(process.env.REACT_APP_API_URL + "/posts", dataPost, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}

async function postsDetail(id) {
    let data = await Axios.get(process.env.REACT_APP_API_URL + "/posts/" + id, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}

async function postsList(params) {
    let data = await Axios.get(process.env.REACT_APP_API_URL + "/posts", {
        headers: {
            authorization: GetToken()
        },
        params: params
    })
    return data
}

async function postsPut(dataPut) {
    let data = await Axios.put(process.env.REACT_APP_API_URL + "/posts", dataPut, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}

async function postsPutStatus(dataPut) {
    let data = await Axios.put(process.env.REACT_APP_API_URL + "/posts-stt", dataPut, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}


export {
    postsPost,
    postsDetail,
    postsList,
    postsPut,
    postsPutStatus
}