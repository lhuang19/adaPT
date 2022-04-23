const baseURL = "http://localhost:8000";

export function getApiURL(path) {
  return baseURL + path;
}
/**
 * Wrapper for fetch API
 * @param  path (url)
 * @param data (request body)
 * @returns data and error
 */
export function doAPIRequest(path, data) {
  const formattedData = data;
  formattedData.headers = formattedData.headers || {};
  formattedData.mode = "cors";
  formattedData.headers.Accept = "application/json";
  formattedData.headers["Content-Type"] = "application/json";
  formattedData.body = JSON.stringify(formattedData.body);
  return fetch(getApiURL(path), formattedData)
    .then((response) => response.json())
    .catch((err) => console.error(err));
}
