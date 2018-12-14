import * as fetch from 'isomorphic-fetch'


function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {

    return response;
  }

  const error: any = new Error(response.status + ' - ' + response.url);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function checkCode(json) {
  if (json.code === 2000) {
    return json;
  }
  throw json.code+'-code error';
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(`https://api.github.com`+ url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => data)
    .catch((err) => { throw err; });
}

