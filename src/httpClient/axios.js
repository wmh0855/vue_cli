import http from "./interceptors";
import Qs from 'qs';
export function getRequest (url, data = {}) {
  return new Promise((resolve, reject) => {
    http
      .get(url, {
        params: data
      })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}
export function postRequest (url, data = {}) {
  return new Promise((resolve, reject) => {
    http
      .post(url, Qs.stringify((data)))
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}
