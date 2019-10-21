export function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
// 需要注意！如果localStorage.getItem(key)是undefined，JSON.parse会报错。
// 设置默认值，这样就不必每次在使用getItem后都判断存不存在
export function getItem(key, defaultVal) {
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) : defaultVal
}

export function removeItem(key) {
    localStorage.removeItem(key);
}
