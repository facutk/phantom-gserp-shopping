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

            var results = [];

            var products = document.querySelector('div#search')
                                   .querySelector('ol')
                                   .querySelectorAll('li');

            var productsLen = products.length;

            var productsMaxItem = (productsLen > 3)? 3: productsLen;

            var productLines = [];
            for (var i=0; i<productsMaxItem; i++){

              var product = products[i].querySelector('div');
              var productSections = product.querySelectorAll('div');

              var productLine = {
                currency: '',
                price: '',
                stores: '',
                img_src: '',
                img_alt: '',
                description: '',
                link_href: '',
                link_desc: ''
              };

              for (var j = productSections.length - 1; j >= 0; j--) {
                
                var productSection = productSections[j];
                if ( productSection.className != '' ) {
                  /*
                  There are diffent kinds of sections.
                  We cant access them directly by XPATH because their class changes dinamically
                  
                  Currently, we have the following structure 

                  <div class="??">
                    <a href="LINK_HREF">
                      <img alt="IMG_ALT" src="IMG_SRC">
                    </a>
                  </div>

                  <div class="??">
                    <h3 class="r">
                      <a href="LINK_HREF">LINK_DESC</a>
                    </h3>
                    <div>DESCRIPTION</div>
                  </div>

                  <div class="??">
                    <div><b>CURRENCY PRICE</b></div>
                    <div>STORES</div>
                  </div>
                  */

                  var productImage = productSection.querySelector('img');
                  var productH3 = productSection.querySelector('h3');

                  if ( productImage == null && productH3 == null ) {
                    /* currency, price, stores */

                    var productCurPriceStores = productSection.querySelectorAll('div');
                    if ( productCurPriceStores.length > 0) {
                      var productCurPrice = productCurPriceStores[0].innerText;
                      productLine.currency = productCurPrice.substring(0,3);
                      productLine.price = productCurPrice.substring(3);

                      if ( productCurPriceStores.length > 1) {
                        var productStores = productCurPriceStores[1].innerText;
                        productLine.stores = productStores;
                      };
                    };

                  } else if ( productImage ) {
                    /* image src, image alt text */

                    var productImage = productSection.querySelector('img');
                    if ( productImage ) {
                      productLine.img_src = productImage.src;
                      productLine.img_alt = productImage.alt;
                    };

                  } else if (productH3) {
                    /* link href, link description, product description */

                    var productDescription = productSection.querySelector('div');
                    if ( productDescription ) {
                      productLine.description = productDescription.innerText; 
                    };

                    var productLink = productSection.querySelector('a');
                    if ( productLink ) {
                      productLine.link_href = productLink.href;
                      productLine.link_desc = productLink.innerText;
                    };

                  };

                };

              };
            
              productLines.push( productLine );
            };

            
            results.push({
              len: productsLen,
              entries: productLines
            });

            return JSON.stringify( results, null, 4 ;

          });

          console.log( products );
          //page.render('page.png');
          phantom.exit();

        }, delay);

      } else {
        //page.render('page.png');
        phantom.exit();
      };
    }, delay);
  });
}
