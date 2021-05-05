import Axios from 'axios'
async function auth(dataPost) {
    let data = await Axios.post(process.env.REACT_APP_API_URL + "/login", dataPost)
    return data
}

async function auth_google(dataPost) {
    console.log(dataPost)
    let data = await Axios.post(process.env.REACT_APP_API_URL + "/login-google", dataPost)
    return data
}


export {
    auth,
    auth_google
}