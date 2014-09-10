var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var async = require('async');
// var cron_job = require('cron').CronJob;
var twitter = require('twitter');
var config = require('./config');
var twit = new twitter({
    consumer_key: config.twitter_api_key,
    consumer_secret: config.twitter_api_secret,
    access_token_key: config.twitter_access_token_key,
    access_token_secret: config.twitter_access_token_secret
});

// arguments
var POEM_FILE = argv.poem || null;
// var START_FROM = argv.startfrom || 0;
var BOOKMARK_FILE = './bookmark.dat';

// bomb out if requirements aren't met
if (!POEM_FILE) {
	console.log('--poem not specified');
	process.exit();
}

var params_for_last_tweet = {
	user_id: config.twitter_api_key,
	count: 1,
	include_entities: true	
};

// 1. read bookmark
//		-- if no bookmark, start at 0
// 2. read poem
// 3. tweet poem at line bookmark
// 4. note down new bookmark
async.parallel([
	checkBookmark,
	function (done) { fs.readFile(POEM_FILE, 'utf8', done); }
], function (err, results) {
	var bookmark = results[0] ? (results[0].trim() === '' ? 0 : parseInt(results[0].trim())) : 0;
	var poem = results[1].split('\n');
	var line = poem[bookmark % poem.length];
	var new_bookmark = (bookmark + 1) % poem.length;
	fs.writeFile(BOOKMARK_FILE, new_bookmark+'\n', 'utf8', function(err) {
		if (err) throw err;
		// twit.updateStatus(line, function(data) {
		// 	return 'tweeted line '+ line +' at '+data.created_at;
	 //    });
		console.log(line);
	});
});

function checkBookmark(callback) {
	fs.exists(BOOKMARK_FILE, function (exists) {
		if (exists) {
			fs.readFile(BOOKMARK_FILE, 'utf8', callback);
		} else {
			callback();
		}
	});
};
