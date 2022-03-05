// 基于axios封装的请求模块
import axios from "axios";

// 创建请求对象
const request = axios.create({
    // baseURL: 'https://conduit.productionready.io'
    baseURL: "https://api.realworld.io"
})

export default request