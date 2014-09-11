desideratis
===========

A node app that tweets a line from an inspirational poem.

Combine with `cron` for an app that posts a line of something every so often.

## Get started

1. Clone repo.
2. Run `npm install`.
3. Set up your/ app in Twitter to get your API and access token info.
4. Add your API and access token into to the config.
5. Add a poem text file, with one line per line. No empty line at the end.
6. Run app using `node index.js`. Use `node index.js --help` for override instructions.

## crontab command

Example for running at 8am every day:

`00 08 * * * node /path/to/index.js > /path/to/logfile.log`