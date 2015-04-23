var url = 'https://www.google.com.br/search?q='
var delay = 5000;
var system = require('system');

if (system.args.length < 2) {
  console.log('Usage: phantomjs phantom-gserp-shopping.js <keyword> [--proxy=host:port]');
  phantom.exit(1);
} else {
  var page = require('webpage').create();
  page.onConsoleMessage = function( msg ) {
    console.log( msg );
  };
  page.viewportSize = { width: 1024, height: 768 };
  var keyword = system.args[1];
  var query = url + keyword;

  page.open(query, function(status) {

    setTimeout(function() {

      var shoppingLinkFound = page.evaluate(function() {

        var as = document.querySelectorAll('a');
        for (var i=0; i<as.length; i++){
          if (as[i].textContent === 'Shopping') {
            var shoppingLink = as[i];
            var ev = document.createEvent('MouseEvents');
            ev.initEvent('click', true, true);
            shoppingLink.dispatchEvent(ev);
            return true;
          }
        }
        return false;
        
      });

      if ( shoppingLinkFound ) {

        setTimeout(function() {

          var products = page.evaluate(function() {

            var productsArray = [];
            var products = document.querySelector('div#search')
                                   .querySelector('ol')
                                   .querySelectorAll('li');
            
            var productsQuantity = (products.length > 3)? 3: products.length;

            for (var i=0; i<productsQuantity; i++){
              productsArray.push({
                product: products[i].innerHTML
              });
            }
            return JSON.stringify(productsArray,null,4);

          });

          console.log( products );
          page.render('page.png');
          phantom.exit();

        }, delay);

      } else {
        page.render('page.png');
        phantom.exit();
      };
    }, delay);
  });
}