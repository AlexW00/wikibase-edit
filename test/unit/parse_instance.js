require('should')
const { __ } = require('config')
const parseInstance = __.require('lib/parse_instance')
const instance = 'https://hello.bla'
const apiEndpoint = `${instance}/w/api.php`

describe('parseInstance', () => {
  it('reject a missing instance', done => {
    parseInstance.bind(null, {}).should.throw('missing config parameter: instance')
    done()
  })

  it('return an instance and sparql endpoint', done => {
    const configA = { instance }
    const configB = { instance: apiEndpoint }
    parseInstance(configA)
    parseInstance(configB)
    configA.instance.should.equal(apiEndpoint)
    configB.instance.should.equal(apiEndpoint)
    done()
  })
})
