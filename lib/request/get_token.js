const login = require('./login')
const GetFinalToken = require('./get_final_token')
const getClient = require('./client')

module.exports = config => {
  const getFinalToken = GetFinalToken(config)

  if (config.credentials.oauth) {
    return getFinalToken
  } else {
    return async () => {
      const client = getClient('post')
      await login(config, client)
      return getFinalToken(client)
    }
  }
}
