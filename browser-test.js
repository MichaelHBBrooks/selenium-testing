var box_of_browsers = require('./browser-actual.js');

box_of_browsers(process.argv[2], function(json) {
    console.log(json);
});