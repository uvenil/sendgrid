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
    res.return = !res.return? {}: res.return
    res.return = {resobj: ro, ...res.return}
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
    res.return = !res.return? {}: res.return
    res.return = {reqbody: req.body, ...res.return}
    console.log("res.return: ", res.return)
    next()
  },
  
  end: (req, res, next) => res.end(JSON.stringify(res.return, null, 2))
  // end: (req, res, next) => res.end("res.return: " + JSON.stringify(res.return))
})
