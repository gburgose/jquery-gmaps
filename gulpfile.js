/*
|--------------------------------------------------------------------------
| Gulpfile
|--------------------------------------------------------------------------
|
| buildfile for jquery.gmaps plugin
|
*/

var gulp              = require('gulp');
var concat            = require('gulp-concat');
var uglify            = require('gulp-uglify');
var rename            = require("gulp-rename");
var addsrc            = require('gulp-add-src');
var removeEmptyLines  = require('gulp-remove-empty-lines');
var beautify          = require('gulp-beautify');
var sass              = require('gulp-sass');
var strip             = require('gulp-strip-comments');
var cssmin            = require('gulp-cssmin');
var livereload        = require('gulp-livereload');

gulp.task('build:js', function() {
  gulp.src(['./src/**/*.js'])
    // default
    .pipe(concat('jquery.gmaps.js'))
    .pipe(beautify({indent_size: 2}))
    .pipe(strip( {ignore: /\/\*\*\s*\n([^\*]*(\*[^\/])?)*\*\//g} ))
    .pipe(removeEmptyLines({ removeComments: true }))
    .pipe(gulp.dest('./dist'))
    // min
    .pipe(uglify({ preserveComments: false }))
    .pipe(rename({ suffix : '.min' }))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
});

gulp.task('build:css', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('jquery.gmaps.css'))
    .pipe(gulp.dest('./dist'))
    // min
    .pipe(cssmin())
    .pipe(rename({ suffix : '.min' }))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
});

gulp.task('build:html', function () {
  return gulp.src('./test/**/*.html')
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./src/**/*.js', ['build:js']);
  gulp.watch('./src/**/*.scss', ['build:css']);
  gulp.watch('./test/**/*.html', ['build:html']);
});
