
import axios, { AxiosRequestConfig } from "axios";

interface reqParam {
    url: string;
    data?: any;
    type?: 'GET' | 'POST';
    retry?: number;
}
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    retry?: number | undefined;
}

axios.interceptors.request.use(function (config: CustomAxiosRequestConfig) {
    if (config.method == 'get' && config.headers.retry === undefined) {
        config.headers.retry = 2;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});


axios.interceptors.response.use(undefined, err => {
    const config = err.config;
    console.log('request fail...', err)
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.headers.retry || config.headers.retry <= 0) return Promise.reject(err);

    config.headers.retry--;
    return axios(config);
});


export default function req(options: reqParam) {
    const { url, data, type, retry } = options;
    return axios({
        url,
        data,
        method: type,
        headers: {
            retry
        }
    })
}

function _axios(type: 'get' | 'post') {
    if (type == 'get') {
        return function (url: string, config?: CustomAxiosRequestConfig | undefined) {
            if (config && config.retry) {
                config.headers.retry = config.retry;
            }
            axios.get(url, config);
            axios[type](url, config);
        }
    }

    return function (url: string, data?: any, config?: CustomAxiosRequestConfig | undefined) {
        if (config && config.retry) {
            config.headers.retry = config.retry;
        }
        axios[type](url, data, config);
    }
}


req.get = _axios('get');
req.post = _axios('post');