

module.exports = {

  main: {
    port: 3333,
    public: '/public'
  },

  admin: {
    pass: '1234'
  },

  auth: {
    redirect: {
      "login": {
        win: '/account',
        fail: '/',
        always: true
      }
    }
  },
  "facebook" : {
    "appId" : "APP_ID",
    "appSecret" : "APP_SECRET",
    "urlhost" : "http://localhost:3333",
    "serviceParams": {
      "scope" : [
        "email"
      ]
    }
  },
  "google" : {
    "clientID" : "CLIENT_ID",
    "clientSecret" : "CLIENT_SECRET",
    "urlhost" : "http://localhost:3333"
  },

  // custom options for the api plugin, which contains the 
  // core business logic of the app
  api:{
    amqp_url: 'amqp://guest:guest@localhost:5672/',

    // admin user password, ** CHANGE THIS ** for production
    admin: { pass: 'admin' },

    // set up test users and events for debugging
    dev_setup: {
      users:{ 
        count: 8 
      },
    }
  },

}
