/**
 * @file Attempts to launch and record various browsers through Selenium and then reports the
 *       findings to ServiceNow.
 * @author Michael Brooks
 */

var os = require('os');
var request = require('request');
var webdriverio = require('webdriverio');
var winston = require('winston');

var browser_actual = require('./browser-actual.js');

var host = 'https://dev30875.service-now.com';
var authentication = {
    username: 'admin',
    password: 'Password1234'
}
var table = [];
table['clients'] = 'x_cerso_capio_clients';
table['client_capabilities'] = 'x_cerso_capio_client_capabilities';

processSNClient(host, authentication, table['clients']);
// getActualCapabilities(process.argv[2]);



function processSNClient(host, authentication, table) {
    var query = 'host_name=' + os.hostname();
    listSNRecords(host, authentication, table, query, function(records) {
        // var sys_id = records[0] //******************************************
        console.log(records);
        // if (sys_id === 'undefined') {
        //     var record = {
        //         architecture: os.arch(), // eg. x64
        //         host_name: os.hostname(),
        //         mac_address: getMacAddress(),
        //         platform: os.platform(), // eg. win32
        //         release: os.release(), // eg. 6.1.7601
        //         type: os.type() // eg. Windows_NT
        //     }
        //     createRecord(host, authentication, table, record);
        // } else {
        //     updateRecord(host, authentication, table, record, sys_id);
        // }
    });
}

/**
 * [getMacAddress description]
 * @return {[type]} [description]
 * @todo  Write this function. Loop on os.networkInterfaces(); to find first non-zero MAC address.
 */
function getMacAddress() {
    return '00:00:00:00:00:00';
}

/**
 * Find the actual capabilities of a given browser. Unfortunately, this may only happen once the
 *   browser has been launched. Therefore the browser will be launched, recorded, then closed.
 * @param  {String} browser_type The name of the browser. If "all", then all known browsers will be
 *   attempted.
 */
function getActualCapabilities(browser_type) {
    var browsers = getBrowserClients(browser_type);

    browsers.forEach(function(browser) {
        browser.init().then(function(init_result) {
            var browser_results = getInitDetails(init_result);
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
 * @param  {JSON object} json A JSON object that Selenium created upon initialization of a browser.
 */
function getInitDetails(json) {
    // console.log(json);
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


/**
 * [retrieveRecord description]
 * @param  {[type]} host           [description]
 * @param  {[type]} authentication [description]
 * @param  {[type]} table          [description]
 * @param  {[type]} sysparm_query  [description]
 * @return {[type]}                [description]
 * @todo  Write this function. Don't forget to convert the query (eg. = should be %3D).
 */
function listRecords(host, authentication, table, sysparm_query, callback) {
    callback('undefined');
}

function createRecord(host, authentication, table, record, successful_cb) {
    if (typeof host === 'undefined' ||
        typeof authentication === 'undefined' ||
        typeof table === 'undefined' ||
        typeof record === 'undefined') {
        winston.log('error', 'undefined argument');
    }
    var options = {
        method: 'POST',
        url: host + '/api/now/table/' + table,
        auth: authentication,
        json: record
    };

    request(options, function(err, httpResponse, body) {
        if (err) {
            winston.log('error', err);
        }
        if (body) {
            console.log('----------------------------------------------------------');
            console.log(body);
            console.log('----------------------------------------------------------');
            if (body.error) {
                if (body.error.message) {
                    console.log(body.error.message);
                }
            } else {
                var sys_id = body.result.sys_id;
                successful_cb(sys_id);
            }
        }
    });
}

/**
 * [updateRecord description]
 * @param  {[type]} host           [description]
 * @param  {[type]} authentication [description]
 * @param  {[type]} table          [description]
 * @param  {[type]} record         [description]
 * @param  {[type]} sys_id         [description]
 * @return {[type]}                [description]
 * @todo  Write this function.
 */
function updateRecord(host, authentication, table, record, sys_id) {

}