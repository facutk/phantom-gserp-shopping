var phantom = require('phantom');
phantom.create(
  /*
  // Proxy option works, but gets rejected by Google.
  {
    parameters: {
      proxy: '200.217.64.220:8080'
    }
  },
  */
  function (browser) {
    browser.createPage(function (page) {
      page.open( 'http://local.host:8000', function (status) {
        setTimeout(function() {
          if (status === 'success') {
            page.includeJs('productsPageParser.js', function(){
              return page.evaluate(function(){
                return productsPageParser();
              },function(result){
                console.log(result);
                return browser.exit();
              });
            });
          }
        }, 5000);
      });
    });
  }
);