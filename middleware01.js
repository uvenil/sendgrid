module.exports = options => ({
  example: function (options) {
    return function (req, res, next) {
      // Implement the middleware function based on the options object
      next()
    }
  },
  // ex: (req, res, next) => {

  reqobj: (req, res, next) => {
    const {baseUrl, body, fresh, hostname, ip, ips, method, originalUrl, params, path, query, requestTime, secure, stale, subdomains, xhr} = req
    ro = {baseUrl, body, fresh, hostname, ip, ips, method, originalUrl, params, path, query, requestTime, secure, stale, subdomains, xhr}
    console.log(ro)
    res.send(JSON.stringify(ro))
    next()
  },

  requestTime: (req, res, next) => {
    req.requestTime = Date.now()
    next()
  },

  answer: (req, res, next) => { // return req.body
    console.log('request method: ', req.method);
    res.setHeader('Content-Type', 'text/plain')
    res.write('you posted and sent by mail:\n')
    res.return = "req.body: " + JSON.stringify(req.body, null, 2)
    console.log(res.return)
    next()
  },
  
  end: (req, res, next) => res.end("fertig!\n\n" + res.return)
})
