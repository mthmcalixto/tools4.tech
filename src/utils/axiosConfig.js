import axios from 'axios'

const AxiosConfig = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HEROKU_URL,
})

export default AxiosConfig
