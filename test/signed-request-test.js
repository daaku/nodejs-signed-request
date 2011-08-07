var signedRequest = require('signed-request')
  , assert = require('assert')

exports['sign and verify'] = function(beforeExit) {
  var data = { answer: 42 }
    , secret = 'abcd'
    , signed = signedRequest.stringify(data, secret)
    , parsed = signedRequest.parse(signed, secret, 1000)
  assert.equal(data.answer, parsed.answer, 'expect the answer.')
}
