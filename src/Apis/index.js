import axios from 'axios'
// import { store } from '.';


export const apiRequest = axios.create({baseURL: process.env.REACT_APP_ENDPOINT})

apiRequest.interceptors.request.use(config => {
  //Access token
  console.log('Request URL', config.baseURL + config.url)
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
  }
  //If any is stored
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))
apiRequest.interceptors.response.use((response) => {
  return response
}, function (error) {
  //Token refresh can take place here
  console.log(error)
  return Promise.reject(error);
});
