/**
 * @file Attempts to launch various browsers through Selenium.
 * @author Michael Brooks
 */

var webdriverio = require('webdriverio');

/**
 * Find the actual capabilities of a given browser. Unfortunately, this may only happen once the
 *   browser has been launched. Therefore the browser will be launched, recorded, then closed.
 * @param  {String} browser_type   The name of the browser. If "all", then all known browsers will
 *   be attempted.
 * @param  {Function} callback     A callback function handed a JSON object containing the browser
 *   name and version.
 */
var getActualCapabilities = function(browser_type,callback) {
    var browsers = getBrowserClients(browser_type);

    browsers.forEach(function(browser) {
        browser.init().then(function(browser_result) {
            var browser_details = getBrowserDetails(browser_result);
            callback(browser_details);
            browser.end();
        }, function(failure) {
            console.log('Unable to launch "' + browser.desiredCapabilities.browserName + '"');
        });
    });
}

/**
 * Create clients for each desired browser.
 * @param  {String} browser_type The name of the browser. If "all", then all knwon browsers will be
 *   attempted.
 * @return {webdriverio.remote Object array} Creates an array of webdriverio.remote objects.
 */
function getBrowserClients(browser_type) {
    var browsers = [];
    if (browser_type === 'all') {
        browsers.push(webdriverio.remote(getDesiredCapabilitiesJSON('chrome')));
        browsers.push(webdriverio.remote(getDesiredCapabilitiesJSON('firefox')));
        // browsers.push(webdriverio.remote(getDesiredCapabilitiesJSON('safari')));
        browsers.push(webdriverio.remote(getDesiredCapabilitiesJSON('internet explorer')));
    } else {
        browsers.push(webdriverio.remote(getDesiredCapabilitiesJSON(browser_type)));
    }
    return browsers;
}

/**
 * Create a desiredCapabilities JSON object for Selenium to attempt to launch.
 * @see http://webdriver.io/guide/getstarted/configuration.html
 * @see https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#capabilities-json-object
 * @param {String} browser_type The browser that Selenium should attempt to launch.
 * @return {JSON Object} Returns a JSON object that follows the desiredCapabilities specification.
 */
function getDesiredCapabilitiesJSON(browser_type) {
    var options = {
        desiredCapabilities: {
            browserName: browser_type
        }
    };
    return options;
}

/**
 * Record the browser details that Selenium reported when it launched the browser.
 * @param  {JSON Object} json A JSON object that Selenium created upon initialization of a browser.
 * @return {JSON Object} Returns a 
 */
function getBrowserDetails(json) {
    var browser_name = json.value.browserName;
    var browser_version;
    if (browser_name === 'chrome' || browser_name === 'internet explorer') {
        // Uses chromedriver.exe and IEDriverServer.exe respectively
        browser_version = json.value.version;
    } else if (browser_name === 'firefox') {
        // Uses geckodriver.exe
        browser_version = json.value.browserVersion;
    }
    return {
        browser_name: browser_name,
        browser_version: browser_version
    };
}

module.exports = getActualCapabilities;