import axios from "axios"

const axiosInstance = axios.create({
   baseURL: `https://parcelx-auth-server.onrender.com`,
})
const UseAxios = () => {
  return (
    axiosInstance
  )
}

export default UseAxios