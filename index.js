var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var async = require('async');
var twitter = require('twitter');
var config = require('./config');

var _TWIT = new twitter({
    consumer_key: config.twitter_api_key,
    consumer_secret: config.twitter_api_secret,
    access_token_key: config.twitter_access_token_key,
    access_token_secret: config.twitter_access_token_secret
});
var _BOOKMARK_FILE = './bookmark.dat';
var _POEM_FILE = config.poem;

// arguments
var START_FROM = argv.startfrom !== undefined ? (argv.startfrom === true ? 0 : argv.startfrom) : null;
var HELP = argv.help || null;

// help if asked
if (HELP) {
    console.log('--startfrom <number>','\t','(optional) Set bookmark to <number>. First line is 0. Will % at poem length. Empty --startfrom will reset to 0.');
    process.exit();
}

// 1. check bookmark & read poem
// 2. grab bookmarked line
// 3. update bookmark
// 4. tweet line
async.parallel([
    checkBookmark,
    function (done) { fs.readFile(_POEM_FILE, 'utf8', done); }
], function (err, results) {
    if (err) console.log(err);
    var bookmark = results[0];
    var poem = results[1].split('\n');
    var line = poem[bookmark % poem.length];
    var new_bookmark = (bookmark + 1) % poem.length;
    fs.writeFile(_BOOKMARK_FILE, new_bookmark+'\n', 'utf8', function(err) {
        if (err) throw err;
        tweetMessage(line, function(data) {
            console.log('tweeted line', bookmark, ':', data.text, 'at', data.created_at);
        });
    });
});

function checkBookmark(callback) {
    if (START_FROM === null) {
        fs.exists(_BOOKMARK_FILE, function (exists) {
            if (exists) {
                fs.readFile(_BOOKMARK_FILE, 'utf8', function(err, data) {
                    if (data === null) {
                        callback(null, 0);
                    } else {
                        callback(null, parseInt(data.trim()));
                    }
                });
            } else {
                callback(null, 0);
            }
        });     
    } else {
        callback(null, START_FROM);
    }
}

function tweetMessage(message, callback) {
    _TWIT.updateStatus(message, callback);
}
