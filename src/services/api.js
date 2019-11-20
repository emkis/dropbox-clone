import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dropbox-clone-back.herokuapp.com/',
})

export default api