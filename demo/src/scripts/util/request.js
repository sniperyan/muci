import fetch from 'isomorphic-fetch';
import { notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * 基于isomorphic-fetch 封装的请求工具，支持mock数据,支持全局提示
 *
 * @param  {string} url        请求地址
 * @param  {object} [options]  传递给 fetch 的参数，参考文档:https://github.github.io/fetch/
 * @param  {object} [mockData] 自定义模拟数据
 * @return {object}            An object containing either "data" or "err"
 */
export default function request(url, options, mockData) {

  // return mock data if it exist
  if (typeof mockData === 'object') {
    return new Promise(resolve => {
      resolve({
        success: true,
        data: mockData,
      });
    });
  }
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT'
    || newOptions.method === 'DELETE') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = typeof newOptions.body === 'object' ? JSON.stringify(newOptions.body) : newOptions.body;
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  /**
   * 返回值示例：
   * {
   *  body:{},
   *  header:{}
   * }
   *
   */
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      let headers = {};
      response.headers.forEach((value, name) => {
        headers[name] = value;
      });
      let status = response.status;
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text().then(res => {
          return { body: res, headers: headers, status:status };
        });
      }
      return response.text().then((text) => {
        return text ? { body: JSON.parse(text), headers: headers, status:status } : { body: null, headers: headers, status:status };
      });
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // logout
        return;
      }
      if (status === 403) {
        //403
        return;
      }
      if (status <= 504 && status >= 500) {

        return;
      }
      if (status >= 404 && status < 422) {

      }
    });
}
