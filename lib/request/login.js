const fetch = require('./fetch')
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
  return getSessionCookies(loginUrl, config, headers, loginCookies)
}

const getLoginToken = async (loginUrl, config, headers) => {
  const { username: lgname, password: lgpassword } = config.credentials
  let body = new URLSearchParams()
  body.append('lgname', lgname)
  body.append('lgpassword', lgpassword)
  body = body.toString()

  const res = await fetch(loginUrl, { method: 'post', headers, body })
  return parseLoginCookies(res)
}

const getSessionCookies = async (loginUrl, config, headers, loginCookies) => {
  const { cookies, token: lgtoken } = loginCookies
  const { username: lgname, password: lgpassword } = config.credentials
  let body = new URLSearchParams()
  body.append('lgname', lgname)
  body.append('lgpassword', lgpassword)
  body.append('lgtoken', lgtoken)
  body = body.toString()

  const headersWithCookies = Object.assign({}, headers, { Cookie: cookies })

  const res = await fetch(loginUrl, {
    method: 'post',
    headers: headersWithCookies,
    body
  })

  const resBody = await parseResponseBody(res)
  console.log(resBody)
  if (!resBody.login.token) {
    throw error_.new('failed to login: invalid username/password')
  }

  return resBody.login.token
}

const parseLoginCookies = async res => {
  const body = await res.json()
  console.log('parse token', body)
  const token = body.login.token
  console.log('token', token)
  // const cookies = res.headers.get('set-cookie')
  return { token }
}
