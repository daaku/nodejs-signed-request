signed-request [![Build Status](https://secure.travis-ci.org/nshah/nodejs-signed-request.png)](http://travis-ci.org/nshah/nodejs-signed-request)
==============

A signed JSON container. The form is basically:

```javascript
base64url(hmac256(json(data))).base64url(json(data))
```

That's a base64 URL encoded hmac256 hash of the JSON representation of the
data, followed by a dot `.`, followed by the base64 URL encoded JSON
representation itself.

This is the same as the
[Facebook `signed_request`](https://developers.facebook.com/docs/authentication/signed_request/).
But it's generically useful.
