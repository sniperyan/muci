export const setCookie = (key, value) => {
  const exp = new Date();
  exp.setTime(exp.getTime() + (1000 * 60 * 60 * 24));
  document.cookie = `${key}=${value};expires=${exp.toGMTString()};path=/`;
};
  
  
export const getCookie = (key) => {
  const ca = document.cookie.split(';');
  let value = '';
  ca.forEach((item) => {
    const c = item;
    if (c.indexOf(`${key}=`) >= 0) {
      value = c.replace(`${key}=`, '');
    }
  });
  return value.trim();
};
  
export const setLocalStorage = (name, val) => {
  localStorage.setItem(name, JSON.stringify(val));
};
  
export const getLocalStorage = name => JSON.parse(localStorage.getItem(name));
  