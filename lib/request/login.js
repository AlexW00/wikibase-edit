const fetch = require('./fetch')
const qs = require('querystring')
const contentType = 'application/x-www-form-urlencoded'
const error_ = require('../error')
const parseResponseBody = require('./parse_response_body')

module.exports = config => {
  const headers = {
    'user-agent': config.userAgent,
    'content-type': contentType
  }

  const loginUrl = `${config.instanceApiEndpoint}?action=login&format=json`

  return login(loginUrl, config, headers)
}

const login = async (loginUrl, config, headers) => {
  const loginCookies = await getLoginToken(loginUrl, config, headers)
  const sessionCookies = getSessionCookies(loginUrl, config, headers, loginCookies)
  return sessionCookies
}

const getLoginToken = async (loginUrl, config, headers) => {
  const { username: lgname, password: lgpassword } = config.credentials
  const body = qs.stringify({ lgname, lgpassword })
  const res = await fetch(loginUrl, { method: 'post', headers, body })
  return parseLoginCookies(res)
}

const getSessionCookies = async (loginUrl, config, headers, loginCookies) => {
  const { cookies, token: lgtoken } = loginCookies
  const { username: lgname, password: lgpassword } = config.credentials
  const body = qs.stringify({ lgname, lgpassword, lgtoken })

  const headersWithCookies = Object.assign({}, headers, { Cookie: cookies })

  const res = await fetch(loginUrl, {
    method: 'post',
    headers: headersWithCookies,
    body
  })

  const resBody = await parseResponseBody(res)
  if (resBody.login.result !== 'Success' && resBody.login.result !== 'NeedToken') {
    console.log('login fail', resBody)
    throw error_.new('failed to login: invalid username/password')
  }

  return { token: resBody.login.token }
}

const parseLoginCookies = async res => {
  const body = await res.json()
  const token = body.login.token
  const cookies = res.headers.get('set-cookie')
  return { token, cookies }
}
