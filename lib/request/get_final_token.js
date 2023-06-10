const contentType = 'application/x-www-form-urlencoded'
const error_ = require('../error')

const origin = window?.location?.origin

module.exports = config => async (client) => {
  const { instanceApiEndpoint, credentials, userAgent } = config

  const urlParams = new URLSearchParams({
    action: "query",
    meta: "tokens",
    type: "csrf",
    format: "json",
    origin,
  });
  const headers = {
    "Content-Type": "application/json",
  };

  const url = `${instanceApiEndpoint}?${urlParams.toString()}`;
  const params = {
    headers: {
      'user-agent': userAgent,
      'content-type': contentType
    }
  }
  const response = await client(url, params);
  return response.data.query.tokens.csrftoken;
}
