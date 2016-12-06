

module.exports = {

  main: {
    port: 3334,
  },

  // custom options for the plugin which contains the 
  // core business logic of the app
  runs: {
    amqp_url: 'amqp://guest:guest@localhost:5672/'
  },

}