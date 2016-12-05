module.exports = function (config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/bootstrap/dist/js/bootstrap.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/angular-cookies/angular-cookies.js',
      'node_modules/angular-messages/angular-messages.js',
      'node_modules/angular-material/angular-material.js',
      'node_modules/angular-material-data-table/dist/md-data-table.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/angular-translate/dist/angular-translate.js',
      'node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/mdPickers/dist/mdPickers.js',
      'node_modules/moment/moment.js',
      'app/app.js',
      'app/app.config.js',
      'app/app.filters.js',
      'app/app.routes.js',
      'app/authentication/*.js',
      'app/authentication/services/*.js',
      'app/authentication/controllers/*.js',
      'app/navbar/*.js',
      'app/navbar/services/*.js',
      'app/navbar/controllers/*.js',
      'app/runs/*.js',
      'app/runs/services/*.js',
      'app/runs/controllers/*.js',
      'app/users/*.js',
      'app/users/services/*.js',
      'app/users/controllers/*.js',
      'templates/**/*.html'
    ],

    exclude: [],

    preprocessors: {
      'templates/**/*.html': ['ng-html2js'],
      'templates/**/!(*.mock|*.spec).js': ['coverage']
    },

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'templates/',
      // create a single module that contains templates from all the files
      moduleName: 'templates'
    },

    reporters: ['spec', 'coverage'],

    coverageReporter: {
      type: 'html',
      // output coverage reports
      dir: 'coverage/'
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false
  });
};
