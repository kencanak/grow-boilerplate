'use strict';

const fs = require('fs');
const gulp = require('gulp');
const runSequence = require('run-sequence');

fs.readdirSync('./gulp/tasks').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/tasks/' + file);
});

gulp.task('serve', function(callback) {
  return runSequence(
    ['compile-js', 'compile-sass', 'svg_sprites'],
    'watch',
    callback);
});

gulp.task('grow-build', function(callback) {
  return runSequence(
    ['compile-js', 'compile-sass', 'svg_sprites'],
    'htmlmin',
    'sw',
    callback
  );
});

gulp.task('default', ['serve']);
