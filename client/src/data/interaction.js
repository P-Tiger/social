import Axios from 'axios'
import {
    GetToken
} from '../configs'
async function interactionsPost(dataPost) {
    let data = await Axios.post(process.env.REACT_APP_API_URL + "/interactions", dataPost, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}

async function interactionsDetail(id) {
    let data = await Axios.get(process.env.REACT_APP_API_URL + "/interactions/" + id, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}

async function interactionsList(params) {
    let data = await Axios.get(process.env.REACT_APP_API_URL + "/interactions", {
        headers: {
            authorization: GetToken()
        },
        params: params
    })
    return data
}

async function interactionsPut(dataPut) {
    let data = await Axios.put(process.env.REACT_APP_API_URL + "/interactions", dataPut, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}

async function interactionsPutStatus(dataPut) {
    let data = await Axios.put(process.env.REACT_APP_API_URL + "/interactions-stt", dataPut, {
        headers: {
            authorization: GetToken()
        }
    })
    return data
}


export {
    interactionsPost,
    interactionsDetail,
    interactionsList,
    interactionsPut,
    interactionsPutStatus
}