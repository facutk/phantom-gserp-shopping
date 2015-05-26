window.productsPageParser = function() {
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
      position: i + 1,
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

  return JSON.stringify( results, null, 4 );
  
};