import { postRequest, getRequest } from "./axios";
import { baseUrl, baseUrl_New } from "./urlconfig";

export const demo = (data)=>{
    return postRequest(`${baseUrl}/xxxx`,data)
};