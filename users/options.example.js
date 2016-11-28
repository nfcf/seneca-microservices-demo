

module.exports = {

  main: {
    port: 3335,
  },

  // custom options for the plugin which contains the 
  // core business logic of the app
  users: {
    amqp_url: 'amqp://guest:guest@localhost:5672/',
    
    admin: { pass: 'admin' }, // admin user password, ** CHANGE THIS ** for production

    // set up test users and events for debugging
    dev_setup: {
      users:{ 
        count: 4 
      },
    }
  },

}