require('should')
const addClaim = require('../../lib/claim/add')
const { randomString, sandboxEntity: id, sandboxStringProp } = require('../utils')
const property = sandboxStringProp

describe('claim add', () => {
  it('should set the action to wbcreateclaim', done => {
    addClaim({
      id,
      property: 'P600',
      datatype: 'ExternalId',
      value: 'someid'
    })
    .action.should.equal('wbcreateclaim')
    done()
  })

  it('should return formatted data for an external id', done => {
    addClaim({
      id,
      property: 'P600',
      datatype: 'ExternalId',
      value: 'someid'
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P600',
      snaktype: 'value',
      value: '"someid"'
    })
    done()
  })

  it('should return formatted data for a wikibase item', done => {
    addClaim({
      id,
      property: 'P50',
      datatype: 'WikibaseItem',
      value: 'Q627323'
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P50',
      snaktype: 'value',
      value: '{"entity-type":"item","numeric-id":627323}'
    })
    done()
  })

  it('should return formatted data for a year', done => {
    addClaim({
      id,
      property: 'P578',
      datatype: 'Time',
      value: '1802'
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P578',
      snaktype: 'value',
      value: '{"time":"+1802-00-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":9,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  it('should return formatted data for a month', done => {
    addClaim({
      id,
      property: 'P578',
      datatype: 'Time',
      value: '1802-02'
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P578',
      snaktype: 'value',
      value: '{"time":"+1802-02-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":10,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  it('should return formatted data for a day', done => {
    addClaim({
      id,
      property: 'P578',
      datatype: 'Time',
      value: '1802-02-03'
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P578',
      snaktype: 'value',
      value: '{"time":"+1802-02-03T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  it('should add a time claim with a low precision', done => {
    addClaim({
      id,
      property: 'P578',
      datatype: 'Time',
      value: { time: '2500000', precision: 4 }
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P578',
      snaktype: 'value',
      value: '{"time":"+2500000-00-00T00:00:00Z","timezone":0,"before":0,"after":0,"precision":4,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
    })
    done()
  })

  // Not implemented by the Wikidata API
  // it('should add a time claim with a high precision', done => {
  //   addClaim({
  //     id,
  //     property: 'P578',
  //     datatype: 'Time',
  //     value: { time: '1802-02-04T11:22:33Z', precision: 14 }
  //   })
  //   .data.should.deepEqual({
  //     entity: id,
  //     property: 'P578',
  //     snaktype: 'value',
  //     value: '{"time":"+1802-02-04T11:22:33Z","timezone":0,"before":0,"after":0,"precision":14,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"}'
  //   })
  //   done()
  // })

  it('should reject a claim with an invalid time', done => {
    try {
      addClaim({
        id,
        property: 'P578',
        datatype: 'Time',
        value: '1802-22-33'
      })
    } catch (err) {
      err.message.should.equal('invalid time value')
      done()
    }
  })

  it('should reject a claim with an invalid time (2)', done => {
    try {
      addClaim({
        id,
        property: 'P578',
        datatype: 'Time',
        value: '1802-02-04T11'
      })
    } catch (err) {
      err.message.should.equal('invalid time value')
      done()
    }
  })

  it('should return formatted data for monolingualtext', done => {
    addClaim({
      id,
      property: 'P1476',
      datatype: 'Monolingualtext',
      value: { text: 'bulgroz', language: 'fr' }
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P1476',
      snaktype: 'value',
      value: '{"text":"bulgroz","language":"fr"}'
    })
    done()
  })

  it('should return formatted data for a quantity', done => {
    addClaim({
      id,
      property: 'P1106',
      datatype: 'Quantity',
      value: 9000
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P1106',
      snaktype: 'value',
      value: '{"amount":"+9000","unit":"1"}'
    })
    done()
  })

  it('should return formatted data for a quantity passed as a string', done => {
    addClaim({
      id,
      property: 'P1106',
      datatype: 'Quantity',
      value: '9001'
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P1106',
      snaktype: 'value',
      value: '{"amount":"+9001","unit":"1"}'
    })
    done()
  })

  it('should return formatted data for a quantity with a unit', done => {
    addClaim({
      id,
      property: 'P1106',
      datatype: 'Quantity',
      value: { amount: 9001, unit: 'Q7727' }
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P1106',
      snaktype: 'value',
      value: '{"amount":"+9001","unit":"http://www.wikidata.org/entity/Q7727"}'
    })
    done()
  })

  it('should return formatted data for a negative amount', done => {
    addClaim({
      id,
      property: 'P1106',
      datatype: 'Quantity',
      value: -9002
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P1106',
      snaktype: 'value',
      value: '{"amount":"-9002","unit":"1"}'
    })
    done()
  })

  it('should throw when passed an invalid string number', done => {
    try {
      addClaim({
        id,
        property: 'P1106',
        datatype: 'Quantity',
        value: '900$1'
      })
    } catch (err) {
      err.message.should.equal('invalid string number: 900$1')
      done()
    }
  })

  it('should return formatted data for a Url', done => {
    addClaim({
      id,
      property: 'P2078',
      datatype: 'Url',
      value: 'http://foo.bar'
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P2078',
      snaktype: 'value',
      value: '"http://foo.bar"'
    })
    done()
  })

  it('should return formatted data for a globe coordinate', done => {
    addClaim({
      id,
      property: 'P626',
      datatype: 'GlobeCoordinate',
      value: { latitude: 45.758, longitude: 4.84138, precision: 1 / 360 }
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P626',
      snaktype: 'value',
      value: '{"latitude":45.758,"longitude":4.84138,"precision":0.002777777777777778}'
    })
    done()
  })

  it('should add a claim of snaktype novalue', done => {
    addClaim({
      id,
      property: 'P1106',
      datatype: 'Quantity',
      value: { snaktype: 'novalue' }
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P1106',
      snaktype: 'novalue'
    })
    done()
  })

  it('should add a claim of snaktype somevalue', done => {
    addClaim({
      id,
      property: 'P1106',
      datatype: 'Quantity',
      value: { snaktype: 'somevalue' }
    })
    .data.should.deepEqual({
      entity: id,
      property: 'P1106',
      snaktype: 'somevalue'
    })
    done()
  })
})
