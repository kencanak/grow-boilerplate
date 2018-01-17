const gulp = require('gulp');
const path = require('path');
const htmlmin = require('gulp-htmlmin');

const config = require('../config');

gulp.task('htmlmin', function() {
  return gulp.src(config.HTML_DIST)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true
    }))
    .pipe(gulp.dest(config.BUILD));
});