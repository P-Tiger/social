import Axios from 'axios'
import {
    GetToken
} from '../configs/'
async function newsPost(dataPost) {
    let data = await Axios.post(process.env.REACT_APP_API_URL + "/news", dataPost, {
        headers: {
            'content-type': 'multipart/form-data',
            authorization: GetToken()
        }
    })
    return data
}

async function newsDetail(id) {
    let data = await Axios.get(process.env.REACT_APP_API_URL + "/news/" + id, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}

async function newsList(id) {
    let data = await Axios.get(process.env.REACT_APP_API_URL + "/news/" + id, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}

export {
    newsPost,
    newsDetail,
    newsList
}