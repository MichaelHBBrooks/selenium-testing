/**
 * @file Attempts to launch various browsers through Selenium.
 * @author Michael Brooks
 */

var webdriverio = require('webdriverio');

/**
 * Find the actual capabilities of a given browser. Unfortunately, this may only happen once the
 *   browser has been launched. Therefore the browser will be launched, recorded, then closed.
 * @async
 * @param  {String} browser_type            - The name of the browser.
 */
var getActualCapabilities = function(browser_type) {
    return new Promise(function(resolve, reject) {

        var browser = webdriverio.remote(getDesiredCapabilitiesJSON(browser_type));
        browser.init().then(function(browser_result) {
                var browser_details = getBrowserDetails(browser_result);
                // success_cb(browser_details);
                browser.end().then(resolve(browser_details));
            },
            reject);
    });
};

/**
 * Create a desiredCapabilities JSON object for Selenium to attempt to launch.
 * @see http://webdriver.io/guide/getstarted/configuration.html
 * @see https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#capabilities-json-object
 * @param {String} browser_type - The browser that Selenium should attempt to launch.
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
 * Record the browser details that Selenium reported when it launched the browser. Different drivers
 * store the version number in different locations.
 * @param  {JSON Object} json - A JSON object that Selenium created upon initialization of a browser.
 * @return {JSON Object} Returns a JSON object with the browser_name and browser_version defined.
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