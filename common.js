/* This file is PUBLIC DOMAIN. You are free to cut-and-paste to start your own projects, of any kind */
"use strict";

// load system modules
var util = require('util');

// define a seneca plugin
// loaded in app.js with seneca.use('<plugin_name>')
// seneca plugins are just a function that adds some actions to the seneca instance
// the options for the plugin are passed as the first argument
module.exports = function (options) {
  // plugin functions are called with the seneca instance as the context
  // store a reference so you can the seneca instance later
  var seneca = this;
  // the name of the plugin
  // because plugins can be registered more than once (using tags)
  // this string is often used to identify the "role" that the plugin performs
  // (this is just a convention, you are free to create action patterns any way you like)
  var plugin_name = 'common';

  // merge default options with any provided by the caller
  options = seneca.util.deepextend({
    prefix: '/' + plugin_name
  }, options);

  // express needs a scalable session store if you want to deploy to more than one machine
  // this is simple implementation using seneca entities
  function session_store(session) {

    function SessionStore() {
      var self = this;

      session.Store.call(this, {});

      var session_ent = seneca.make$('session');

      self.get = function(sid, cb) {
        session_ent.load$(sid, function(err, sess){
          cb(err, sess && sess.data);
        });
      }

      self.set = function(sid, data, cb) {
        session_ent.load$(sid,function(err, sess){
          if(err) return cb(err);
          sess = sess || session_ent.make$({id$:sid});
          sess.last = new Date().getTime();
          sess.data = data;
          sess.save$(cb);
        });
      }

      self.destroy = function(sid, cb) {
        session_ent.remove$(sid,cb);
      }
    }
    util.inherits(SessionStore, session.Store);

    return new SessionStore();
  }

  // to finish the registration of a plugin, you need to return a meta data obect that
  // defines the name of the plugin, and it's tag value (if any, used if there is more than one instance of the same plugin)
  // here, you also define an express session store
  // Just a reminder: plugin definition is synchronous - that's why you return this object
  return {
    name: plugin_name,
    exportmap: {
      // this object can be accessed using seneca.export('<plugin_name>/session-store')
      'session-store': session_store
    }
  }
}