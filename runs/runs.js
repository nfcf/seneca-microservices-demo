/* This file is PUBLIC DOMAIN. You are free to cut-and-paste to start your own projects, of any kind */
'use strict';

// load utility modules
var _ = require('lodash'); // see http://npmjs.org/package/lodash

// the name of the plugin
// because plugins can be registered more than once (using tags)
// this string is often used to identify the "role" that the plugin performs
// (this is just a convention, you are free to create action patterns any way you like)
var name = 'runs';

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

  var run_entity = seneca.make('mvp', 'runs');

  // add your actions to seneca by providing an input pattern to match
  // the function definitions are below
  // it's convenient to list all the action patterns in once place
  // this also serves to document them for maintenance coders
  seneca.add({role: name, cmd: 'save'}, save);
  seneca.add({role: name, cmd: 'load'}, load);
  seneca.add({role: name, cmd: 'list'}, list);
  seneca.add({role: name, cmd: 'remove'}, remove);

  seneca.add({role: name, cmd: 'getstats'}, getStats);
  // the init:name action is special - it is invoked for each
  // plugin, in order, after all the plugins are loaded
  // this is a good place to put any initial data storage interactions
  // just make sure you've defined a data store already
  seneca.add({init: name}, init);


  // ACTION: initialize plugin
  // args: none
  //
  // result: no value
  function init (args, done) {
    seneca.act({ role: 'basic', cmd: 'define_sys_entity' }, { list: ['-/mvp/runs'] });

    seneca.use('seneca-amqp-transport');
    seneca.listen({
      type: 'amqp',
      pin: {role: name},
      url: options.amqp_url
    });

    done();
  }

  function save (args, done) {
    var seneca = this;

    if (!args.user.admin && !!args.entity.createdBy &&
        (args.entity.createdBy !== args.user.email)) {
      return done(null, {
        http$: { status: 401 },
        ok: false,
        why: 'Not Authorized'
      });
    }

      // create entity instances to interact with data storage
    var entity = run_entity.make$();

    entity.active = true;
    entity.createdBy = args.user.email;
    for (var k in args.entity) entity[k] = args.entity[k];

    entity.save$(function(err, res) {
      done(err, res);
    });
  }

  function load (args, done) {
    var seneca = this;

    var entity = run_entity.make$();
    entity.load$(args.entity_id, function (err, res) {
      if (!args.user.admin &&
        (args.entity.createdBy !== args.user.email)) {
        return done(null, {
          http$: { status: 401 },
          ok: false,
          why: 'Not Authorized'
        });
      }

      done(err, res);
    });
  }

  function list (args, done) {
    var seneca = this;
    var filter;

    if (args.query.filter) {
      // TODO: Unfortunately seneca-memstore / query doesn't support regex or > or < operations.
      // Therefore, I'm not filtering here and am only filtering after the
      // results are returned...

      // args.query.description = new RegExp(args.query.filter);
      filter = JSON.parse(args.query.filter);
    }

    // delete args.query.filter;
    // args.query.active = true;

    var entity = run_entity.make$();
    entity.list$(/* args.query, */function (err, res) {
      if (err) done(err);

      res = _.filter(res, function (ent) {
        return ent.active &&
               (args.user.admin || ent.createdBy === args.user.email) &&
               (!filter ||
               (new Date(filter.startDate) <= new Date(ent.occurredAt).withoutTime() &&
               new Date(filter.endDate) >= new Date(ent.occurredAt).withoutTime() &&
               filter.startTime.substr(11, 5) <= ent.occurredAt.substr(11, 5) &&
               filter.endTime.substr(11, 5) >= ent.occurredAt.substr(11, 5)));
      });

      done(null, res);
    });
  }

  function remove (args, done) {
    var seneca = this;

    var entity = run_entity.make$();
    entity.load$(args.entity_id, function (err, res) {
      if (!err) done(err);
      else if (!args.user.admin &&
              (res.createdBy !== args.user.email)) {
        return done(null, {
          http$: { status: 401 },
          ok: false,
          why: 'Not Authorized'
        });
      }

      res.active = false;
      res.save$(function (err, res) {
        done(err, res);
      });
    });
  }

  function getStats (args, done) {
    var seneca = this;

    args.filter = args.filter || { };

    var entity = run_entity.make$();
    entity.list$(args.filter, function (err, res) {
      var stats = {};
      stats.weekly_distance = 0;
      for (var i = 0; i < res.length; i++) {
        if (res[i].createdBy === args.user.email) {
          stats.weekly_distance += res[i].distance;
        }
      }
      done(err, stats);
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

Date.prototype.withoutTime = function () {
  var d = new Date(this);
  d.setHours(0, 0, 0, 0, 0);
  return d;
}
