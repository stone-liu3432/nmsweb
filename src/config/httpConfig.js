import axios from "axios";
import qs from "qs";

axios.defaults.timeout = 5000;

if (process.env.NODE_ENV === "development") {
    //  开发模式
    axios.defaults.baseURL = "http://192.168.5.58:8200";
} else if (process.env.NODE_ENV == "production") {
    //  生产模式
    axios.defaults.baseURL = "";
}
//  request拦截器  -->  全局request添加请求头
axios.interceptors.request.use(
    config => {
        //  to do
        var token = sessionStorage.getItem("x-token");
        if (token) {
            config.headers["x-token"] = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//  response拦截器  -->  全局错误处理
axios.interceptors.response.use(
    response => {
        return response;
    },
    err => {
        err.response
            ? console.log(`${err.response.status} ${err.response.statusText}`)
            : console.log("Unknow error");
        return Promise.reject(err);
    }
);

export const _qs = ({ url, params }) => {
    if (!url || typeof url !== "string") {
        return "";
    }
    //  url第一个字符不为 / 时，添加
    if (url.charCodeAt(0) !== 47) {
        url = `/${url}`;
    }
    if (!params) {
        return url;
    }
    return url.indexOf("?") === -1
        ? `${url}?${qs.stringify(params)}`
        : `${url}&${qs.stringify(params)}`;
};

export const devProxy = ({ devicelist, url, method, param }) => {
    return axios.post("/api/proxy", {
        devicelist,
        url,
        method,
        param
    });
};

export default axios;