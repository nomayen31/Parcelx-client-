import axios from "axios"

const axiosInstance = axios.create({
   baseURL: `https://parcelx-server.vercel.app`,
})
const UseAxios = () => {
  return (
    axiosInstance
  )
}

export default UseAxios