import axios, { type AxiosRequestConfig } from "axios";

const client = axios.create({
    baseURL: `http://localhost:9000/api/`
    // baseURL: 'http://140.9.70.21:8000/api/'
});
let refresh = false;

client.interceptors.request.use((config) => ({
    ...config,
    myMagicProperty: performance.now(),
  }), null, { synchronous: true });

client.interceptors.response.use(resp => resp, async error =>{
    if (error.response.status === 401 && !refresh) {
        refresh = true;
        const {data, status} = await axios.get('refresh', {withCredentials: true});
        // console.log( data, error)
        if(status === 200) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return axios(error.config);
        }
    }
    refresh = false;
    return error;
});
  
export default client;