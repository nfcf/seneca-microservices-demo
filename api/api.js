/* This file is PUBLIC DOMAIN. You are free to cut-and-paste to start your own projects, of any kind */
'use strict';

// load system modules
var util = require('util');

// load utility modules
var _ = require('lodash'); // see http://npmjs.org/package/lodash

// the name of the plugin
// because plugins can be registered more than once (using tags)
// this string is often used to identify the "role" that the plugin performs
// (this is just a convention, you are free to create action patterns any way you like)
var name = 'api';

// define a seneca plugin
// loaded in app.js with seneca.use('<plugin_name>')
// seneca plugins are just a function that adds some actions to the seneca instance
// the options for the plugin are passed as the first argument
module.exports = function (options) {
  // plugin functions are called with the seneca instance as the context
  // store a reference so you can the seneca instance later
  var seneca = this;

  // merge default options with any provided by the caller
  options = seneca.util.deepextend({
    prefix: '/' + name
  }, options);

  // this is the standard system entity for user, with
  // base:sys, name:user, see http://senecajs.org/data-entities.html
  var user_entity = seneca.make('sys', 'user');

  // add your actions to seneca by providing an input pattern to match
  // the function definitions are below
  // it's convenient to list all the action patterns in once place
  // this also serves to document them for maintenance coders
  seneca.add({ role: name, cmd: 'whoami' }, whoami);

  seneca.add({ role: name, cmd: 'users_save' }, usersSave);
  seneca.add({ role: name, cmd: 'users_list' }, usersList);
  seneca.add({ role: name, cmd: 'users_remove' }, usersRemove);

  seneca.add({ role: name, cmd: 'runs_save' }, runsSave);
  seneca.add({ role: name, cmd: 'runs_load' }, runsLoad);
  seneca.add({ role: name, cmd: 'runs_list' }, runsList);
  seneca.add({ role: name, cmd: 'runs_remove' }, runsRemove);
  seneca.add({ role: name, cmd: 'runs_get_stats' }, runsGetStats);

  // the init:name action is special - it is invoked for each
  // plugin, in order, after all the plugins are loaded
  // this is a good place to put any initial data storage interactions
  // just make sure you've defined a data store already
  seneca.add({ init: name }, init);


  // ACTION: initialize plugin
  // args: none
  //
  // result: no value
  function init(args, done) {
    seneca.use('seneca-amqp-transport');

    // Any message with the below "roles" will be sent to the
    // corresponding amqp client
    seneca.client({
      type: 'amqp',
      pin: { role: 'runs' },
      url: options.amqp_url
    });

    seneca.client({
      type: 'amqp',
      pin: [{ role: 'users' }, { role: 'user' }],
      url: options.amqp_url
    });

    done();
  }


  // ACTION: provide client with current user context, if logged in
  // args:
  //   user:  user model
  //   event: event model
  //
  // result: meta data object: {}
  function whoami(args, done) {
    var seneca = this
    // Question: how do these args get set in the first place?
    // Answer: see below: the ensure_entity action and also setcontext function
    var user = args.user;

    done(null, user);
  }


  function usersSave(args, done) {
    var seneca = this

    if (args.entity_id) {
      args.entity.id = args.entity_id;
    }

    seneca.act({
      role: 'users',
      cmd: 'save',
      user: args.user,
      entity: args.entity
    }, function (err, res) {
      if (err) done(err);
      else done(null, res);
    });
  }

  function usersList(args, done) {
    var seneca = this

    seneca.act({
      role: 'users',
      cmd: 'list',
      user: args.user,
      query: {
        filter: args.filter,
        sort$: args.sort,
        skip$: (args.page - 1) * args.limit,
        limit$: args.limit
      }
    }, function (err, res) {
      if (err) done(err);
      else done(null, res);
    });
  }

  function usersRemove(args, done) {
    var seneca = this

    seneca.act({
      role: 'users',
      cmd: 'remove',
      entity_id: args.entity_id
    }, function (err, res) {
      if (err) done(err);
      else done(null, res);
    });
  }


  function runsSave(args, done) {
    var seneca = this

    if (args && args.req$.method === 'PUT' && args.entity_id) {
      args.entity.id = args.entity_id;
    }

    seneca.act({
      role: 'runs',
      cmd: 'save',
      user: args.user,
      entity: args.entity
    }, function (err, res) {
      if (err) done(err);
      else done(null, res);
    });
  }

  function runsLoad(args, done) {
    var seneca = this

    seneca.act({
      role: 'runs',
      cmd: 'load',
      entity_id: args.entity_id
    }, function (err, res) {
      if (err) done(err);
      else done(null, res);
    });
  }

  function runsList(args, done) {
    var seneca = this

    seneca.act({
      role: 'runs',
      cmd: 'list',
      user: args.user,
      query: {
        filter: args.filter,
        sort$: args.sort,
        skip$: (args.page - 1) * args.limit,
        limit$: args.limit
      }
    }, function (err, res) {
      if (err) done(err);
      else done(null, res);
    });
  }

  function runsRemove(args, done) {
    var seneca = this

    seneca.act({
      role: 'runs',
      cmd: 'remove',
      entity_id: args.entity_id
    }, function (err, res) {
      if (err) done(err);
      else done(null, res);
    });
  }

  function runsGetStats(args, done) {
    var seneca = this

    seneca.act({
      role: 'runs',
      cmd: 'getstats'
    }, function (err, res) {
      if (err) done(err);
      else done(null, res);
    });
  }



  // Remember the question in the whoami function? How are the user args set? This is part of the answer.
  // As a convention, Seneca actions expect to get full model objects as arguments - this makes
  // your life much easier as you don't need to go find them in the database, cluttering up your
  // code with load$ calls
  // However, sometimes you'll need to specify entities using their identifier string, because
  // that's all you have, so that's a catch 22, right?
  // The solution is to wrap the actions (so that they become priors) with lookup actions
  // It would be tedious to write this code all the time, so the builtin util plugin provides an
  // action that does it for you: cmd:ensure_entity
  seneca.act({
    role: 'basic',
    cmd: 'ensure_entity',
    // specify the action patterns you want to wrap using a 'pin', which is a template
    // action pattern. Use '*' to match any value.
    // in this case, actions like role:api, cmd:whoami will be wrapped
    pin: { role: name, cmd: '*' },
    // look for these arguments, interpret them as entity identifiers, and load them using the given entity
    entmap: {
      user: user_entity
    }
  })


  // This is the other part of the solution to the problem of resolving the user.
  // this function is used by the web service API of this plugin to find the user
  // from the request context
  // The parameters to this function are provided by the seneca.http utility - see below for more details
  function setContext(req, res, args, act, respond) {
    args.user = req.seneca.user;

    // call the business logic function
    act(args, respond);
  }


  // To expose your actions to the outside world over HTTP you can,
  // optionally, provide a 'service' middleware function. You do this
  // by calling the role:web action with a use argument. The use
  // argument can be a plain middleware function, and you can do
  // anything you like in it.

  // However, when there is a relatively direct mapping from your
  // business logic to your HTTP API (which often makes sense), then
  // you can provide a configuration object that defines the routes
  // for your actions.

  // You can use the following properties:
  // name: the name of your plugin
  // prefix: the shared URL prefix; you can use express route syntax
  //         i.e. :param to grad params from the URL pin: the actions that can
  //         be called - with URL format: /prefix/pin_name -
  //         e.g. /api/v1/whoami
  // startware, endware: functions as above
  // map: only those actions appearing in the map can actually be
  //      called, so use this to expose only the parts you want to each map
  //      entry specifies the HTTP method to respond to, like so: GET:true,
  //      POST:true, etc URL parameters, query strings, and request bodies
  //      are all merged into a single sets of arguments for the action You
  //      can also provide custom behaviour, as here, by specifying a
  //      function - e.g. setcontext For more, see:
  //      https://github.com/senecajs/seneca-web

  seneca.act({
    role: 'web',
    use: {
      name: name,
      prefix: '/' + name + '/v1/',
      pin: { role: name, cmd: '*' },
      secure: {
        fail: ''
      },
      // startware: startware,
      map: {
        whoami: {
          GET: setContext
        },

        users_save: {
          alias: 'users/:entity_id/',
          PUT: setContext
        },
        users_list: {
          alias: 'users/',
          GET: setContext
        },
        users_remove: {
          alias: 'users/:entity_id/',
          DELETE: setContext
        },

        runs_save: {
          alias: 'runs/:entity_id?/',
          POST: setContext,
          PUT: setContext
        },
        runs_load: {
          alias: 'runs/:entity_id/',
          GET: setContext
        },
        runs_list: {
          alias: 'runs/',
          GET: setContext
        },
        runs_remove: {
          alias: 'runs/:entity_id/',
          DELETE: setContext
        },
        runs_get_stats: {
          alias: 'runs/get/stats/',
          GET: setContext
        }
      }
      // endware: endware
    }
  });


  // to finish the registration of a plugin, you need to return a meta data obect that
  // defines the name of the plugin, and it's tag value (if any, used if there is more than one instance of the same plugin)
  // here, you also define an express session store
  // Just a reminder: plugin definition is synchronous - that's why you return this object
  return {
    name: name,
    exportmap: {

    }
  }
}
