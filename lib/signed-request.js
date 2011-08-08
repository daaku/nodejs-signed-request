var b64url = require('b64url')
  , crypto = require('crypto')
  , makeError = require('makeerror')
  , ALGORITHM = 'sha256'

exports.InvalidSignatureError = makeError(
  'InvalidSignatureError',
  'The signature was invalid.'
)

exports.ExpiredError = makeError(
  'ExpiredError',
  'The signed request has expired. Was issued at: {issuedAt}.'
)

function copy(data) {
  var clone = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) clone[key] = data[key]
  }
  return clone
}

module.exports.stringify = function(data, secret) {
  if (!secret) throw Error('A secret must be provided.')
  if ('issued_at' in data) throw Error('data must not contain an issued_at.')

  data = copy(data)
  data.issued_at = Date.now() / 1000

  var payload = b64url.encode(JSON.stringify(data))
    , hmac = crypto.createHmac(ALGORITHM, secret).update(payload)
    , sig = b64url.safe(hmac.digest('base64'))

  return sig + '.' + payload
}

module.exports.parse = function(raw, secret, ttl) {
  if (!secret) throw Error('A secret must be provided.')
  if (ttl === undefined) throw Error('A ttl in seconds must be provided.')

  var dotPos = raw.indexOf('.')
    , sig = raw.substr(0, dotPos)
    , payload = raw.substr(dotPos + 1)
    , hmac = crypto.createHmac(ALGORITHM, secret).update(payload)
    , expectedSig = b64url.safe(hmac.digest('base64'))

  if (sig !== expectedSig) throw exports.InvalidSignatureError()

  var data = JSON.parse(b64url.decode(payload))

  if (ttl) {
    var issuedAt = data.issued_at
    if (!issuedAt) throw Error('Did not find issued_at.')
    if (issuedAt + ttl < (Date.now() / 1000))
      throw exports.ExpiredError({ issuedAt: issuedAt })
  }

  return data
}
