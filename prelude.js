// modified from original browser-pack prelude for readability + SES support

(function() {

  function outer(modules, cache, entry) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof require == "function" && require

    function newRequire(name, jumped){
      // check cache
      if (cache[name]) {
        return cache[name].exports
      }
      // check our modules
      const moduleData = modules[name]
      if (moduleData) {
        var module = cache[name] = { exports:{} }
        moduleData[0].call(module.exports, scopedRequire, module, module.exports)
        function scopedRequire (requestedName) {
          var id = moduleData[1][requestedName]
          return newRequire(id || requestedName)
        }
        return module
      }
      // we dont have it, look somewhere else

      // if we cannot find the module within our internal map or
      // cache, jump to the current global require ie. the last bundle
      // that was added to the page.
      var currentRequire = typeof require == "function" && require
      if (!jumped && currentRequire) return currentRequire(name, true)

      // If there are other bundles on this page the require from the
      // previous one is saved to 'previousRequire'. Repeat this as
      // many times as there are bundles until the module is found or
      // we exhaust the require chain.
      if (previousRequire) return previousRequire(name, true)
      var err = new Error('Cannot find module \'' + name + '\'')
      err.code = 'MODULE_NOT_FOUND'
      throw err
    }

    // load entry points
    for(var i=0; i<entry.length; i++) newRequire(entry[i])

    // Override the current require with this new one
    return newRequire
  }

  return outer

})()
