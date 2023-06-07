const axios = require('axios')
const CookieJar = require('tough-cookie').CookieJar
const tough = require('tough-cookie')
const wrapper = require('axios-cookiejar-support').wrapper

const cookieJar = new tough.CookieJar()
axios.defaults.jar = cookieJar
axios.defaults.withCredentials = true

let client

const createAxiosInstance = () => {
  const jar = new CookieJar()
  return wrapper(axios.create({ jar }))
}

const getClient = method => {
  if (client === undefined) {
    client = createAxiosInstance()
  }
  return method === 'post' ? client.post : client.get
}

module.exports = getClient
