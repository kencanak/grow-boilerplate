'use strict';

const WebpackBabiliPlugin = require('babili-webpack-plugin');
const eslint = require('gulp-eslint');
const extend = require('deep-extend');
const gulp = require('gulp');
const path = require('path');
const readdirRecursive = require('fs-readdir-recursive');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const runSequence = require('run-sequence');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const through2 = require('through2');
const replace = require('gulp-replace');

const config = require('../config');

const jsFiles = readdirRecursive(config.JS_SOURCE_DIR);
const entry = {};

jsFiles.forEach((value) => {
  if (value.endsWith('.js')) {
    const key = value.substring(0, value.length - 3);
    entry[key] = config.JS_SOURCE_DIR + value;
  }
});

const webpackConfig = {
  entry: entry,
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, config.JS_OUT_DIR),
    filename: '[name].js'
  }
};

const webpackProdConfig = extend({
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new WebpackBabiliPlugin({}, {
      comments: false
    })
  ]
}, webpackConfig);

gulp.task('third-party-js', function() {
  return gulp.src(config.THIRD_PARTY_JS)
    .pipe(concat('third-party.min.js'))
    .pipe(uglify(config.JS_OPTIONS.uglify))
    .pipe(gulp.dest(config.JS_OUT_DIR));
});

gulp.task('polyfills-js', function() {
  return gulp.src(config.POLYFILLS_JS)
    .pipe(concat('polyfills.min.js'))
    .pipe(uglify(config.JS_OPTIONS.uglify))
    .pipe(gulp.dest(config.JS_OUT_DIR));
});

gulp.task('internal-js', function() {
  return gulp.src(config.JS_SOURCES)
    .pipe(eslint())
    .pipe(webpackStream(
      webpackProdConfig, webpack
    ))
    .pipe(gulp.dest(config.JS_OUT_DIR));
});

const concatTask = () => {
  return through2.obj((file, enc, callback) => {
    Promise.all(
      Object.keys(entry).map((js) => {
        return new Promise((resolve, reject) => {
          if (js !== 'app') {
            const allJs = [];
            allJs.push(path.join(config.JS_OUT_DIR, 'polyfills.min.js'));
            allJs.push(path.join(config.JS_OUT_DIR, 'third-party.min.js'));
            allJs.push(path.join(config.JS_OUT_DIR, 'app.js'));
            allJs.push(path.join(config.JS_OUT_DIR, `${js}.js`));

            gulp.src(allJs)
              .pipe(concat(`${js}.min.js`))
              .pipe(replace(/\/service-worker.js/g, function(match, p1, offset, string) {
                return `${config.ROOT}/service-worker.js`
              }))
              .pipe(gulp.dest(config.JS_OUT_DIR))
              .on('end', resolve);
          } else {
            resolve();
          }
        });
      })
    ).then((resolve) => {
      return callback(null, 'ok');
    });
  });
};

gulp.task('concat-js', function(callback) {
  return gulp.src(config.JS_SOURCES, { read: false })
    .pipe(concatTask());
});

gulp.task('compile-js', function(callback) {
  return runSequence(
    'polyfills-js',
    'third-party-js',
    'internal-js',
    'concat-js',
    callback
  );
});
