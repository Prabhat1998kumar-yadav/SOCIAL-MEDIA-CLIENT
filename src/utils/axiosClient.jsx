import axios from "axios";
import { getItem, KEY_ACCESS_TOKEN, removeItem, setItem } from "./localStorageManager";

import store from "../redux/store"
import { setLoading, showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_APP_SERVER_BASE_URL

export const axiosClient = axios.create({  
  baseURL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {  
  const accessToken = getItem(KEY_ACCESS_TOKEN);  
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  store.dispatch(setLoading(true))
  return request;
});



axiosClient.interceptors.response.use(
  async(response) => {
    store.dispatch(setLoading(false))
    const data = response.data;
    if (data.status === "ok") {
      return response;
    }

    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.message;
    
    store.dispatch(showToast({
      type:TOAST_FAILURE,
      message:error
    }))
    
    if(statusCode === 401 && !originalRequest._retry){
        originalRequest._retry=true
        // const response= await axiosClient.get("/auth/refresh");
        
        const response=await axios.create({
          baseURL,
          withCredentials: true,
        }).get(`${baseURL}/auth/refresh`)
        
        if(response.data.status === "ok"){
           
            setItem(KEY_ACCESS_TOKEN,response.data.result.accessToken);
            originalRequest.headers['Authorization']=`Bearer ${response.data.result.accessToken}`;
            return axios(originalRequest)

        }else{
          removeItem(KEY_ACCESS_TOKEN);
      window.location.replace("/login", "_self");
      return Promise.reject(error);
        }
    }
    return Promise.reject(error)
  },async(error)=>{
    console.log(error)
    store.dispatch(setLoading(false))
    store.dispatch(showToast({
      type:TOAST_FAILURE,
      message:error.message
    }))
    return Promise.reject(error)
  }
);
