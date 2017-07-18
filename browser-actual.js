var webdriverio = require('webdriverio');

var first_arg = process.argv[2];

var browsers = getBrowserClients(first_arg);

browsers.forEach(function(browser) {
    browser.init().then(function(browser_result) {
        recordResult(browser_result);
        browser.end();
    }, function(failure) {
        console.log('Unable to launch "' + browser.desiredCapabilities.browserName + '"');
    });
});

function getBrowserClients(browser_type) {
    var browsers = [];
    if (browser_type === 'all') {
        browsers.push(webdriverio.remote(getCapabilitiesJSON('chrome')));
        browsers.push(webdriverio.remote(getCapabilitiesJSON('firefox')));
        // browsers.push(webdriverio.remote(getCapabilitiesJSON('safari')));
        browsers.push(webdriverio.remote(getCapabilitiesJSON('internet explorer')));
    } else {
        browsers.push(webdriverio.remote(getCapabilitiesJSON(browser_type)));
    }
    return browsers;
}

function getCapabilitiesJSON(browser_type) {
    var options = {
        desiredCapabilities: {
            browserName: browser_type
        }
    };
    return options;
}

function recordResult(json) {
    console.log(json);
    var browser_name = json.value.browserName;
    var browser_version;
    if (browser_name === 'chrome' || browser_name === 'internet explorer') {
        browser_version = json.value.version;
    } else if (browser_name === 'firefox') {
        browser_version = json.value.browserVersion;
    }
    console.log('Browser Name: ' + browser_name);
    console.log('Browser Version: ' + browser_version);
}