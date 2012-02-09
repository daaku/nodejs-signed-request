var signedRequest = require('signed-request')
  , assert = require('assert')

function isInt(n) {
  return typeof n == 'number' && n % 1 === 0
}

exports['sign and verify'] = function() {
  var data = { answer: 42 }
    , secret = 'abcd'
    , signed = signedRequest.stringify(data, secret)
    , parsed = signedRequest.parse(signed, secret, 1000)
  assert.equal(data.answer, parsed.answer, 'expect the answer.')
}

exports['issued_at is an integer'] = function() {
  var data = { answer: 42 }
    , secret = 'abcd'
    , signed = signedRequest.stringify(data, secret)
    , parsed = signedRequest.parse(signed, secret, 1000)
  assert(isInt(parsed.issued_at))
}
