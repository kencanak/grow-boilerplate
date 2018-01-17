'use strict';

const gulp = require('gulp');
const gulpAutoprefixer = require('gulp-autoprefixer');
const path = require('path');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const scssLint = require('gulp-scss-lint');
const modifyCssUrls = require('gulp-modify-css-urls');

const config = require('../config');

gulp.task('compile-sass', function() {
  return gulp.src(config.SASS_SOURCE_DIR)
    .pipe(scssLint({
      'config': '.scsslintrc.yml'
    }))
    .pipe(sass({
      outputStyle: 'compressed'
    })).on('error', sass.logError)
    .pipe(modifyCssUrls({
      modify: (url, filePath) => {
        return `${config.ROOT}/${url.slice(config.SOURCE_PREFIX.length)}`;
      }
    }))
    .pipe(rename(function(path) {
      path.basename += '.min';
    }))
    .pipe(gulpAutoprefixer({
      browsers: [
        'last 1 version',
        'last 2 iOS versions'
      ],
    }))
    .pipe(gulp.dest(config.SASS_OUT_DIR));
});
