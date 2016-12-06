/// <binding AfterBuild='default' />
var gulp = require('gulp');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var print = require('gulp-print');
var angularFilesort = require('gulp-angular-filesort');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var del = require('del');
var StringDecoder = require('string_decoder').StringDecoder;
var through = require('through2');

gulp.task('default', ['clean'], function () {
  runSequence(['clean', /* 'templates-task', */ 'css-task', 'vendors-task', 'spa-task']);
});

gulp.task('clean', function () {
  return del(['.build/']);
});

gulp.task('css-task', function () {
  var target = gulp.src('./index.html');

  var customCssStream = gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.css',
    './node_modules/font-awesome/css/font-awesome.css',
    './node_modules/angular-material/angular-material.css',
    './node_modules/angular-material-data-table/dist/md-data-table.css',
    './node_modules/mdPickers/dist/mdPickers.css',
    './styles/reset.css',
    './styles/style.css'
  ]);

  var mapsStream = gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.css.map']);

  var fontsStream = gulp.src(['./node_modules/font-awesome/fonts/*.*']);

  return target
    .pipe(inject(customCssStream.pipe(print())
      .pipe(concat('styles.css'))
      .pipe(addBOM())
      .pipe(gulp.dest('.build/css')), {
        name: 'styles'
      }))
    .pipe(gulp.dest('./'))
    .pipe(inject(mapsStream
      .pipe(print())
      .pipe(gulp.dest('.build/css'))))
    .pipe(gulp.dest('./'))
    .pipe(inject(fontsStream
      .pipe(print())
      .pipe(gulp.dest('.build/fonts')), {
        name: 'fonts'
      }))
    .pipe(gulp.dest('./'))
});

gulp.task('templates-task', function () {
  var target = gulp.src('./index.html');

  var templatesStream = gulp.src(['./templates/**/*.html']);

  return target
    .pipe(gulp.dest('.build/'))
    .pipe(inject(templatesStream
      .pipe(print())
      .pipe(addBOM())
      .pipe(gulp.dest('.build/templates'))));
});

gulp.task('vendors-task', function () {
  var target = gulp.src('./index.html');

  var vendorStream = gulp.src(['./node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './node_modules/angular/angular.js',
    './node_modules/angular-animate/angular-animate.js',
    './node_modules/angular-aria/angular-aria.js',
    './node_modules/angular-cookies/angular-cookies.js',
    './node_modules/angular-messages/angular-messages.js',
    './node_modules/angular-material/angular-material.js',
    './node_modules/angular-material-data-table/dist/md-data-table.js',
    './node_modules/angular-sanitize/angular-sanitize.js',
    './node_modules/angular-translate/dist/angular-translate.js',
    './node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
    './node_modules/angular-route/angular-route.js',
    './node_modules/mdPickers/dist/mdPickers.js',
    './node_modules/moment/moment.js'
  ]);

  return target
    .pipe(inject(vendorStream
      .pipe(print())
      .pipe(concat('vendors.js'))
      .pipe(uglify())
      .pipe(addBOM())
      .pipe(gulp.dest('.build/vendors')), {
        name: 'vendors'
      }))
    .pipe(gulp.dest('./'));
});

gulp.task('spa-task', function () {
  var target = gulp.src('./index.html');

  var appStream = gulp.src(['./app/*.js',
    './app/authentication/*.js',
    './app/authentication/services/*.js',
    './app/authentication/controllers/*.js',
    './app/navbar/*.js',
    './app/navbar/services/*.js',
    './app/navbar/controllers/*.js',
    './app/runs/*.js',
    './app/runs/services/*.js',
    './app/runs/controllers/*.js',
    './app/users/*.js',
    './app/users/services/*.js',
    './app/users/controllers/*.js',
    '!./app/**/*.spec.js'
  ]);

  return target
    .pipe(inject(appStream
      .pipe(print())
      .pipe(angularFilesort())
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(addBOM())
      .pipe(gulp.dest('.build/spa')), {
        name: 'app'
      }))
    .pipe(gulp.dest('./'));
});

function addBOM() {
  // Creating a stream through which each file will pass
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      // return empty file
      cb(null, file);
    }
    var buf = file.contents;
    var decoder = new StringDecoder('utf8');
    var contents = decoder.write(file.contents);
    var missingBOM = (contents[0] !== 0xEF && contents[1] !== 0xBE && contents[2] !== 0xBB);
    if (file.isBuffer()) {
      if (missingBOM) {
        file.contents = new Buffer('\ufeff' + contents, 'utf-8');
      }
      else {
        file.contents = new Buffer(contents, 'utf-8');
      }
    }
    if (file.isStream()) {
      var stream = through();
      if (missingBOM) {
        stream.write('\ufeff' + contents, 'utf-8');
      }
      else {
        stream.write(contents, 'utf-8');
      }
      file.contents = stream;
    }
    cb(null, file);
  });
}
