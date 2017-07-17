var webdriverio = require('webdriverio');

var arg = process.argv[2];

var chrome_options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};
var firefox_options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};
var safari_options = {
    desiredCapabilities: {
        browserName: 'safari',
    }
};

var browsers = [];
browsers.push(webdriverio.remote(chrome_options));
browsers.push(webdriverio.remote(firefox_options));
browsers.push(webdriverio.remote(safari_options));

var x = arg;
browsers[x].init().then(function(asdf) {
    console.log(asdf)

    // browsers[x].getUrl().then(function(url) {
    //     console.log('Success! URL: ' + url);
    // }, function(err) {
    //     console.log('Error encountered.' + err);
    // });
    browsers[x].end();
},function(failure){
    console.log('Unable to launch '+browsers[x].desiredCapabilities.browserName)
});


// webdriverio
//     .remote(options)
//     .init()
//     .url('http://www.google.com')
//     .getTitle().then(function(title) {
//         console.log('Title was: ' + title);
//     })
//     .end();