const fetch = require('./fetch')
const contentType = 'application/x-www-form-urlencoded'
const error_ = require('../error')
const parseResponseBody = require('./parse_response_body')
const origin = window?.location?.origin

async function getLoginToken(config, client) {
  const { instanceApiEndpoint } = config;
  const urlParams = new URLSearchParams({
    action: "query",
    meta: "tokens",
    type: "login",
    format: "json",
    origin
  });
  const url = instanceApiEndpoint + "?" + urlParams.toString();
  const headers = {
    "Content-Type": "application/json",
  };
  const response = await client(url, {
    headers: headers,
  })
  const data = response.data;
  return data.query.tokens.logintoken;
}

module.exports = async (config, client) => {
  const { instanceApiEndpoint, credentials, userAgent } = config;
  const loginToken = await getLoginToken(config, client);

  const formData = new FormData();
  formData.append("lgname", credentials.username);
  formData.append("lgpassword", credentials.password);
  formData.append("lgtoken", loginToken);

  const urlParams = new URLSearchParams({
    action: "login",
    format: "json",
    origin
  });

  const url = `${instanceApiEndpoint}?${urlParams.toString()}`;

  const r = await client(url, formData)
  return r
}
