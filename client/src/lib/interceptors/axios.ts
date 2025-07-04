
import axios from "axios";

axios.defaults.baseURL = `http://localhost:9000/api/`;
let refresh = false;
axios.interceptors.response.use(resp => resp, async error =>{
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
})