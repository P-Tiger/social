import Axios from 'axios'
import {
    GetToken
} from '../configs/'
async function newsPost(dataPost) {
    let data = await Axios.post(process.env.REACT_APP_API_URL + "/news", dataPost, {
        headers: {
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

async function newsList(params) {
    let data = await Axios.get(process.env.REACT_APP_API_URL + "/news", {
        headers: {
            authorization: GetToken()
        },
        params: params
    })
    return data
}

async function newsPut(dataPut) {
    let data = await Axios.put(process.env.REACT_APP_API_URL + "/news", dataPut, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}

async function newsPutStatus(dataPut) {
    let data = await Axios.put(process.env.REACT_APP_API_URL + "/news-status", dataPut, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}


export {
    newsPost,
    newsDetail,
    newsList,
    newsPut,
    newsPutStatus
}