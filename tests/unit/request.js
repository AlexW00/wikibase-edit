require('module-alias/register')
require('should')
const request = require('lib/request/request')
const nock = require('nock')
const { shouldNotBeCalled, rethrowShouldNotBeCalledErrors } = require('../integration/utils/utils')

describe('request', () => {
  beforeEach(() => {
    nock('https://example.org')
    .get('/')
    .reply(200, '<!doctype html>')
  })

  it('should throw a proper error', async () => {
    try {
      await request('get', { url: 'https://example.org', autoRetry: false }).then(shouldNotBeCalled)
    } catch (err) {
      // log out the error in the unit test output
      // console.log('ERR NAME:', err.name)
      rethrowShouldNotBeCalledErrors(err)
      // err.message.should.equal('Could not parse response: <!doctype html>')
      err.name.should.equal('TypeError')
    }
  })
})
