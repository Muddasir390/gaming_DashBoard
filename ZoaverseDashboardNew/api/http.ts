import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import config from 'config';
// import { getTokenLocalStorage } from 'utils/localStorage';
import config from '../config';
var setTimeoutIntervalForLogout : any;

const axiosInstanceWithoutAuth: AxiosInstance = axios.create({
  baseURL: config.BASE_URL,
});

const axiosInstanceWithAuth: AxiosInstance = axios.create({
  baseURL: config.BASE_URL,
});

// axiosInstanceWithoutAuth.defaults.headers.common['ngrok-skip-browser-warning'] ='69420';
// axiosInstanceWithAuth.defaults.headers.common['ngrok-skip-browser-warning'] ='69420';

// Set Authorization header function
const setAuthorizationHeader = (accessToken: string) => {
  axiosInstanceWithAuth.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${accessToken}`;
};

// const accessTokenStorage = getTokenLocalStorage() || '';
const accessTokenStorage = '';

if (accessTokenStorage) {
  setAuthorizationHeader(accessTokenStorage);
} else {
  axios.interceptors.request.use(
    config => config,
    error => Promise.reject(error),
  );
}

// Add a request interceptor
axiosInstanceWithAuth.interceptors.request.use(
  (config: any) => {
    // Check if the request requires a token
    if (config.headers && config.headers.Authorization) {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthorizationHeader(token); // Set Authorization header
      } else {
        // Handle case where token is missing
        // For example, redirect to login page
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstanceWithAuth.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle successful responses
    return response;
  },
  error => {
    // this function will logout the user when api token is expired.
    if (
      error.response.data.message === 'Session expired. Please log in again.' ||
      error.response.data.error === "You don't have any subscription"
    ) {
      clearInterval(setTimeoutIntervalForLogout);
      // setTimeoutIntervalForLogout = setTimeout(() => {
      //   toast(
      //     `${
      //       language === 'en'
      //         ? 'You are going to Logout. Please Login again'
      //         : 'أنت ذاهب إلى تسجيل الخروج. الرجاء تسجيل الدخول مرة أخرى'
      //     }`,
      //     'info',
      //   );
      //   setTimeout(() => {
      //     window.location.href = '/login';
      //     localStorage.clear();
      //   }, 5000);
      // }, 1000);
    }
    // Handle errors
    return Promise.reject(error);
  },
);

const httpWithAuth = {
  setAuthorizationHeader,
  request(config: AxiosRequestConfig = {}) {
    return axiosInstanceWithAuth.request(config);
  },
  get(url: string, config: AxiosRequestConfig = {}) {
    return axiosInstanceWithAuth.get(url, config);
  },
  post(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return axiosInstanceWithAuth.post(url, data, config);
  },
  put(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return axiosInstanceWithAuth.put(url, data, config);
  },
  patch(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return axiosInstanceWithAuth.patch(url, data, config);
  },
  delete(url: string, config: AxiosRequestConfig = {}) {
    return axiosInstanceWithAuth.delete(url, config);
  },
  pageSize: 999999,
};

const httpWithoutAuth = {
  setAuthorizationHeader,
  request(config: AxiosRequestConfig = {}) {
    return axiosInstanceWithoutAuth.request(config);
  },
  get(url: string, config: AxiosRequestConfig = {}) {
    return axiosInstanceWithoutAuth.get(url, config);
  },
  post(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    
    return axiosInstanceWithoutAuth.post(url, data, config);
  },
  put(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return axiosInstanceWithoutAuth.put(url, data, config);
  },
  patch(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return axiosInstanceWithoutAuth.patch(url, data, config);
  },
  delete(url: string, config: AxiosRequestConfig = {}) {
    return axiosInstanceWithoutAuth.delete(url, config);
  },
  pageSize: 999999,
};

export { httpWithAuth, httpWithoutAuth };
