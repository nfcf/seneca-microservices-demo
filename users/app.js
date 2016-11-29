/* Main application entry point.
 * Run with:
 * $ node app.js
 *
 * Configuration should be in a file named options.app.js in this
 * folder. Copy options.example.js to create this file. It is loaded
 * as a node.js module, so you can use JavaScript inside it.
 *
 * The --env command line argument can be used to start the app in a 
 * development mode for debugging:
 * $ node app.js --env=development
 *
 * The NODE_ENV environment variable can also be used for this purpose
 * $ NODE_ENV=development node app.js
 */

/* This file is PUBLIC DOMAIN. You are free to cut-and-paste to start your own projects, of any kind */
'use strict';


// always capture, log and exit on uncaught exceptions
// your production system should auto-restart the app
// this is the Node.js way
process.on('uncaughtException', function (err) {
  console.error('uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});


// the easiest way to parse command line arguments
// see https://github.com/substack/node-optimist
var argv = require('optimist').argv;


// get deployment type (set to 'development' for development)
// use environment variable NODE_ENV, or command line argument --env
var env = argv.env || process.env['NODE_ENV'] || 'development';


// load the seneca module and create a new instance
// note that module returns a function that constructs seneca instances (just like express)
// so you if you call it right away (as here, with the final () ), you get a default instance
var seneca = require('seneca')({
  log: {
    level: 'info+',
    handler: 'print'
  }
});
seneca.use('basic');
seneca.use('web');
seneca.use('entity');

// register the seneca builtin options plugin, and load the options from a local file

// each seneca plugin can be given options when you register it ("seneca.use"),
// so you don't have to do this, but it does make life easier
// see the options.app.js file for more info
var options_folder = 'production' === env ? '/home/deploy/' : './';
var options_file = options_folder + './options.app.js';
try {
  require('fs').statSync(options_file);
}
catch (e) {
  process.exit(!console.error('Please copy options.example.js to' + options_file + ': ' + e))
}
seneca.use('options', options_file);

// if developing, use a throw-away in-process database
if ('development' === env) {
  // the builtin mem-store plugin provides the database
  // also enable http://localhost:3333/mem-store/dump so you can debug db contents
  seneca.use('mem-store', {
    web: {
      dump: true
    }
  });
}
// if not developing, use a mongo database
else {
  // NOTE: no code changes are required!
  // this is one of the benefits of the using the seneca data entity model
  // for more, see http://senecajs.org/data-entities.html
  seneca.use('mongo-store');
  // register the seneca-memcached plugin - this provides access to a cache layer backed by memcached
  seneca.use('memcached-cache');

  // register the seneca-vcache plugin - this provides version-based caching for
  // data entities over multiple memcached servers, and caches by query in addition to id
  seneca.use('vcache');
}

// register the seneca-user plugin - this provides user account business logic
seneca.use('user', {
  confirm: true
});

// register the seneca-auth plugin - this provides authentication business logic
seneca.use('auth');

seneca.use('account');

// register the seneca-data-editor plugin - this provides a user interface for data admin
// Open the /data-editor url path to edit data! (you must be an admin, or on localhost)
seneca.use('data-editor', {
  admin: {
    local: true
  }
});

// register the common plugin for some exports used accross the micro-services
seneca.use(require('./../common.js'));


seneca.ready(function (err) {
  if (err) return process.exit(!console.error(err));

  // seneca plugins can export objects for external use
  // you can access these using the seneca.export method

  // get the configuration options
  var options = seneca.export('options');
  seneca.log.debug(options.main);

  // get the middleware function from the builtin web plugin
  var web = seneca.export('web');

  var http = require('http');
  var express = require('express');
  var session = require('express-session');

  // create an express app
  var app = express();

  // setup express
  app.use(require('cookie-parser')());
  app.use(require('body-parser').json());

  // Log requests to console
  app.use(function (req, res, next) {
    console.log('EXPRESS', new Date().toISOString(), req.method, req.url);
    next();
  });

  // you can't use a single node in-memory session store if you want to scale
  // common.js defines a session store that uses seneca entities
  var sessionStore = seneca.export('common/session-store');
  app.use(session({
    secret: 'seneca',
    resave: true,
    saveUninitialized: true,
    store: sessionStore(session)
  }));

  // add in the seneca middleware
  // this is how seneca integrates with express (or any connect-style web server module)
  app.use(web);

  var server = http.createServer(app);

  seneca.use('admin', {
    server: server,
    local: true
  });


  // register the seneca-perm plugin - this provides permission checking
  // set the entity option to true, which means, "check all entities"
  seneca.use('perm', {
    act: [{ role: 'users', cmd: 'list' }],
    entity: true
  });

  // register your own plugin - the main app business logic!
  // in the options, indicate if you're in development mode
  seneca.use('users', {
    dev_mode: 'development' === env
  });

  // should make sure that all plugins are fully loaded before starting server
  seneca.ready(function () {
    seneca.act({ init: 'perm' });

    // start listening for HTTP requests
    server.listen(options.main.port);
    seneca.log.info('Listen on', options.main.port);
  });
});
