
import axios, {AxiosRequestConfig} from "axios"

// modules
import { BaseErrorRes } from "../models/BaseErrorRes"





const performLogin = async (email: string, password: string) => {

  const reqBody = {
    email: email,
    password: password,
  }

  const reqConfig: AxiosRequestConfig = {
    baseURL: window.API_URL,
    withCredentials: true
  }

  const res = await axios.post<string|BaseErrorRes>("/user-service/login", reqBody, reqConfig)  
  return res
}




export { performLogin }