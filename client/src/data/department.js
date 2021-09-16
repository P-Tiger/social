import Axios from 'axios'
import {
    GetToken
} from '../configs'
async function departmentList() {
    let data = await Axios.get(process.env.REACT_APP_API_URL + "/departments", {
        headers: { authorization: GetToken() }
    })
    return data
}

export {
    departmentList
}