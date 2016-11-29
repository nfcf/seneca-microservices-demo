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
  function init( args, done ) {

    seneca.act({role: 'basic', cmd: 'define_sys_entity' }, {list:['-/mvp/runs']});

    seneca.use('seneca-amqp-transport');
    seneca.listen({
      type: 'amqp',
      pin: {role: name},
      url: options.amqp_url
    });

    done();

  }

  function save( args, done ) {
    var seneca = this;

      // create entity instances to interact with data storage
    var entity  = run_entity.make$();

    for(var k in args.entity) entity[k] = args.entity[k];
    
    entity.save$(function(err, res){
      done(null,  res);
    });
  }

  function load( args, done ) {
    var seneca = this;

    var entity  = run_entity.make$();
    entity.load$(args.entity_id, function (err, res) {
      done(null, res);
    });
  }

  function list( args, done ) {
    var seneca = this;

    args.filter = args.filter || { };

    var entity  = run_entity.make$();
    entity.list$(args.filter, function (err, res) {
      done(null, res);
    });
  }

  function remove( args, done ) {
    var seneca = this;

    var entity  = run_entity.make$();
    entity.remove$(args.entity_id, function (err, res) {
      done(null, res);
    });
  }

  function getStats( args, done ) {
    var seneca = this;

    args.filter = args.filter || { };

    var entity  = run_entity.make$();
    entity.list$(args.filter, function (err, res) {
      var weekly_distance = 0;
      for (var i = 0; i < res.length; i++) {
        weekly_distance += res[i].distance_in_km;
      }
      done(null, {weekly_distance: weekly_distance });
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