/* This file is PUBLIC DOMAIN. You are free to cut-and-paste to start your own projects, of any kind */
'use strict';

// load utility modules
var _ = require('lodash'); // see http://npmjs.org/package/lodash
var async = require('async'); // see http://npmjs.org/package/async

// the name of the plugin
// because plugins can be registered more than once (using tags)
// this string is often used to identify the "role" that the plugin performs
// (this is just a convention, you are free to create action patterns any way you like)
var name = 'users';

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

  var user_entity = seneca.make('sys', 'user');

  // add your actions to seneca by providing an input pattern to match
  // the function definitions are below
  // it's convenient to list all the action patterns in once place
  // this also serves to document them for maintenance coders
  seneca.add({role: name, cmd: 'save'}, save);
  seneca.add({role: name, cmd: 'load'}, load);
  seneca.add({role: name, cmd: 'list'}, list);
  seneca.add({role: name, cmd: 'remove'}, remove);
  seneca.add({role: 'user', cmd: 'register'}, register);

  // the init:name action is special - it is invoked for each
  // plugin, in order, after all the plugins are loaded
  // this is a good place to put any initial data storage interactions
  // just make sure you've defined a data store already
  seneca.add({init: name}, init);

  if (options.dev_mode) {
    seneca.add({ role: name, cmd: 'fake_users' }, fakeUsers)
  }

  // ACTION: initialize plugin
  // args: none
  //
  // result: no value
  function init(args, done) {
    seneca.use('seneca-amqp-transport');
    seneca.listen({
      type: 'amqp',
      pin: [{ role: 'users' }, { role: 'user' }],
      url: options.amqp_url
    });

    // need to call these actions one after the other in series
    async.series([
      function (callback) {
        seneca.act({ role: 'basic', cmd: 'define_sys_entity' }, { list: ['-/sys/user'] }, function(err, res) {
          callback(err);
        });
      },
      function (callback) {
        // register an admin user so that you can login to the data-editor
        seneca.act({
          role: 'user',
          cmd: 'register',
          name: 'admin',
          email: 'admin@gmail.com',
          pass: options.admin.pass,
          admin: true
        }, function(err, res) {
          callback(err);
        });
      },
      function (callback) {
        // set up fake users for development testing
        // these actions are only defined if in dev mode, so the default$ meta argument 
        // specifies a default result if they can't be found
        seneca.act(_.extend({
          role: name,
          cmd: 'fake_users',
          default$: {}
        }), function(err, res) {
          callback(err);
        });
      },
      function (callback) {
        seneca.use('seneca-amqp-transport');
        seneca.listen({
          type: 'amqp',
          pin: [{ role: name }, { role: 'user' }],
          url: options.amqp_url
        });

        callback();
      }

    ], done);
  }

  function save(args, done) {
    var seneca = this;

    if ((args.entity.admin && !args.user.admin) ||
        (args.entity.manager && !args.user.admin && !args.user.manager)) {
      return done(null, {
        http$: { status: 401 },
        ok: false,
        why: 'Can\'t elevate this user permissions.'
      });
    }

    // create entity instances to interact with data storage
    var entity = user_entity.make$();

    for (var k in args.entity) entity[k] = args.entity[k];

    setUserPermissions(args);

    entity.save$(function (err, res) {
      done(err, res);
    });
  }

  function load(args, done) {
    var seneca = this;

    var entity = user_entity.make$();
    entity.load$(args.entity_id, function (err, res) {
      done(err, res);
    });
  }

  function list(args, done) {
    var seneca = this;
    var filter;

    if (args.query.filter) {
      // TODO: Unfortunately seneca-memstore / query doesn't support regex.
      // Therefore, I'm not filtering here and am only filtering after the
      // results are returned...

      // args.query.name = new RegExp(args.query.filter);
      filter = args.query.filter;
    }

    // delete args.query.filter;
    // args.query.active = true;

    var entity = user_entity.make$();
    entity.list$(/* args.query, */function (err, res) {
      if (err) done(err);

      res = _.filter(res, function (ent) {
        return ent.active &&
               !!ent.email &&
               (!filter ||
               (ent.email.indexOf(filter) >= 0 ||
               (!!ent.name && ent.name.indexOf(filter) >= 0)));
      });

      done(null, res);
    });
  }

  function remove(args, done) {
    var seneca = this;

    var entity = user_entity.make$();
    entity.load$(args.entity_id, function (err, res) {
      if (!err) done(err);
      else if ((res.admin && !args.user.admin) ||
          (res.manager && !args.user.admin && !args.user.manager)) {
        return done(null, {
          http$: { status: 401 },
          ok: false,
          why: 'Not Authorized.'
        });
      }

      res.active = false;
      res.save$(function (err, res) {
        done(err, res);
      });
    });
  }

  function register (args, done) {
    var seneca = this;

    args.admin = args.admin || false;
    args.manager = args.manager || false;
    args.targetWeeklyDistance = 20;

    setUserPermissions(args);
    // this calls the original action, as provided by the user plugin
    seneca.prior(args, done);
  }

  function setUserPermissions(user) {
    user.perm = {
      entity: [
        { base: 'sys', name: 'user', perm$: '' }
      ],
      act: [
        { role: name, perm$: user.admin || user.manager }
      ]
    };
  }


  // ACTION: create some fake users, for testing
  // args:
  //   users:  number to create
  //   {nick,name,pass}prefix: custom prefixes for generated values
  //
  // result: no value
  function fakeUsers(args, done) {
    var seneca = this;

    seneca.act('role:user, cmd:register', {
      email: 'manager@gmail.com',
      name: 'Manager',
      password: 'manager',
      manager: true
    }, function (err) {
      if (err) return done(err);
    });

    seneca.act('role:user, cmd:register', {
      email: 'user@gmail.com',
      name: 'User',
      password: 'user',
      manager: true
    }, function (err) {
      if (err) return done(err);
      return done();
    });
  }


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
