import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from "axios";

const request = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  responseType: "json",
});

export const onSuccess = <T>(response:T) => response

function onError(error: Error | AxiosError) {
  if (isAxiosError(error) && error.response) {

    const { response } = error;

    if (process.env.NODE_ENV === "development") {
      console.log("~~~~~~~~~~~~~~~ Request error ~~~~~~~~~~~~~~~");
      console.log(JSON.stringify(response, null, 2));
    }
  }
  return Promise.reject(error);
}


export default {
  get: <T>(url: string, config?: AxiosRequestConfig<any>) =>
    request.get<T>(url, config).then(onSuccess, onError),
  delete: <T>(url: string, config?: AxiosRequestConfig<any>) =>
    request.delete<T>(url, config).then(onSuccess, onError),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig<any>) =>
    request.post<T>(url, data, config).then(onSuccess, onError),
  put: <T>(url: string, data: any, config?: AxiosRequestConfig<any>) =>
    request.put<T>(url, data, config).then(onSuccess, onError),
  patch: <T>(url: string, data: any, config?: AxiosRequestConfig<any>) =>
    request.patch<T>(url, data, config).then(onSuccess, onError),
  postForm: <T>(url: string, data: any, config?: AxiosRequestConfig<any>) =>
    request.postForm<T>(url, data, config).then(onSuccess, onError),
  patchForm: <T>(url: string, data: any, config?: AxiosRequestConfig<any>) =>
    request.patchForm<T>(url, data, config).then(onSuccess, onError),
};