const getClient = require('./client')

let isNode
try {
  isNode = process.versions.node != null
} catch (err) {
  isNode = false
}
// origin shouldn't be needed for node but I haven't tested it so I'm keeping it for now
let origin
if (isNode) {
  // hard coded for now, but we should probably make it configurable
  origin = 'http://localhost:5173'
} else {
  origin = window.location.origin
}
let agent

if (isNode) {
  // Using a custom agent to set keepAlive=true
  // https://nodejs.org/api/http.html#http_class_http_agent
  // https://github.com/bitinn/node-fetch#custom-agent
  const http = require('http')
  const https = require('https')
  const httpAgent = new http.Agent({ keepAlive: true })
  const httpsAgent = new https.Agent({ keepAlive: true })
  agent = ({ protocol }) => (protocol === 'http:' ? httpAgent : httpsAgent)
}

const addOrigin = (url, origin) => {
  // adds origin url param to avoid CORS issues in the browser
  // see https://www.mediawiki.org/wiki/Manual:CORS#Description for how to
  // configure CORS on the server side
  //
  // Example (in LocalSettings.php):
  // $wgCrossSiteAJAXdomains = [
  // 'http://localhost:5173'
  // ];
  const urlObj = new URL(url)
  urlObj.searchParams.set('origin', origin)
  return urlObj.toString()
}

module.exports = async (url, options = {}) => {
  options.agent = options.agent || agent
  const client = getClient(options.method || 'post')
  url = addOrigin(url, origin)
  options.headers.origin = origin
  const formData = new FormData(),
    data = options.data || {}
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })

  try {
    const r = await client(url, formData, options)
    const text = JSON.stringify(r.data)
    // transform response to match fetch response
    // console.log(r)
    return {
      status: r.status,
      statusText: r.statusText,
      headers: r.headers,
      text: () => Promise.resolve(text),
      json: () => Promise.resolve(r.data),
      body: r.data,
    }
  } catch (err) {
    console.error(err.message)
    return Promise.reject(err)
  }
}
