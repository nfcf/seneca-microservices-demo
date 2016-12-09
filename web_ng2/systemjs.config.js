/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  // map systemJS apis to corresponding apis in requirejs
  window.require = System.amdRequire;
  window.requirejs = System.amdRequire;
  window.define = System.define;

  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      /*'jquery': 'npm:jquery/dist/jquery.js',
      'bootstrap': 'npm:bootstrap/dist/js/bootstrap.js',
      'angular': 'npm:angular/angular.js',
      'angular-animate': 'npm:angular-animate/angular-animate.js',
      'angular-aria': 'npm:angular-aria/angular-aria.js',
      'angular-cookies': 'npm:angular-cookies/angular-cookies.js',
      'angular-messages': 'npm:angular-messages/angular-messages.js',
      'angular-material': 'npm:angular-material/angular-material.js',
      'angular-material-data-table': 'npm:angular-material-data-table/dist/md-data-table.js',
      'angular-sanitize': 'npm:angular-sanitize/angular-sanitize.js',
      'angular-translate': 'npm:angular-translate/dist/angular-translate.js',
      'angular-translate-loader-static-files': 'npm:angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'angular-route': 'npm:angular-route/angular-route.js',
      'mdPickers': 'npm:mdPickers/dist/mdPickers.js',
      'moment': 'npm:moment/moment.js',*/

      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/upgrade/static': 'npm:@angular/upgrade/bundles/upgrade-static.umd.js',

      // other libraries
      'rxjs':                      'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: 'main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      }
    }
  });
})(this);
