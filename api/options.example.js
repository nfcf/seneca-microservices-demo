

module.exports = {

  main: {
    port: 3333,
    public: '/../web'
  },

  auth: {
    prefix: '/auth/',
    default_plugins: {
      // authRedirect: false,
      authTokenCookie: false
    },
    restrict: '/api'
  },

  facebook: {
    appId: 'APP_ID',
    appSecret: 'APP_SECRET',
    urlhost: 'http://localhost:3333',
    serviceParams: {
      scope: [
        'email'
      ]
    }
  },

  google: {
    clientID: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    urlhost: 'http://localhost:3333'
  },

  // custom options for the api plugin, which contains the
  // core business logic of the app
  api: {
    amqp_url: 'amqp://guest:guest@localhost:5672/'
  }
}
