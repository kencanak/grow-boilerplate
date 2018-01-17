'use strict'

const gulp = require('gulp');
const livereload = require('gulp-livereload');

const config = require('../config');

gulp.task('reload', function(callback) {
  setTimeout(function() {
    livereload.reload();
    callback();
  }, 500);
});

gulp.task('watch', function() {
  livereload.listen();

  gulp.watch(config.SASS_SOURCES, ['compile-sass']);
  gulp.watch(config.JS_SOURCES, ['compile-js']);
  gulp.watch(config.SVG_SOURCES, ['svg_sprites']);

  gulp.watch([
    config.SASS_SOURCES,
    config.JS_SOURCES,
    'content/**/*',
    'views/macros/**/*',
    'views/common/**/*',
    'views/templates/**/*',
    'source/**/*',
    'views/*',
    'views/pages/*',
    'views/partials/**/*',
    'podspec.yaml'], ['reload']);
});