var express = require('express');
var app = express();
var phantom = require('phantom');
var fs = require('fs');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/heartbeat', function(request, response) {
  fs.writeFile('timestamp', Date(), function(error) {
    if (error) {
      response.send('error!');
    } else {
      response.send('ok');
    };
  });
});

app.get('/lastbeat', function(request, response) {
  response.send(
    fs.readFileSync('timestamp',{ encoding: 'utf8' })
  );
});

app.get('/q/:id', function(request, response) {

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
        console.log( request.params.id );
        page.open( 'http://' + request.params.id, function (status) {
          console.log("opened page?", status);
          page.evaluate(function () { return document.title; }, function (result) {
            console.log('Page title is ' + result);
            browser.exit();
          });
        });
      });
    }
  );
  response.send( request.params.id );
});


app.get('/', function(request, response) {
  response.send('Hello Node!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
