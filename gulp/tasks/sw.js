'use strict'

const gulp = require('gulp');
const insert = require('gulp-insert');
const packageJson = require('../../package.json');
const path = require('path');
const runSequence = require('run-sequence');
const swPrecache = require('sw-precache');
const fs = require('fs');

const config = require('../config');

const getDynamicDependencies = () => {
  // common dependencies
  let dependencies = [
    'content/pages/_blueprint.yaml',
    'views/base.html',
    'views/common/back-to-top/back-to-top.html',
    'views/macros/_section/_section.html',
    'views/macros/_image.html',
    'views/macros/_button/_button.html',
    'dist/css/main.min.css',
    'dist/css/home.min.css',
    'content/pages/custom-header.yaml',
    'content/pages/home.yaml',
    'content/pages/random-page.yaml'
  ];

  return dependencies;
};

gulp.task('generate-service-worker', function(callback) {
  // Don't cachebust static, fingerprinted assets:
  // - images
  // - css
  // - js
  var avoidCacheBustRegex = /(\/images\/.*\.(jpg|png)|\.css|\.js)/;

  var swConfig = {
    cacheId: packageJson.name + packageJson.version,
    dontCacheBustUrlsMatching: avoidCacheBustRegex,
    skipWaiting: true,

    // PRECACHING:
    // - favicons
    // - css
    // - js
    // - HTML pages (all).
    staticFileGlobs: [
      'source/favicons/*.{png,svg,ico}',
      'source/fonts/*.{ttf,svg,woff}',
      'source/images/**/*.{png,jpg,gif}',
      'source/svg/**/*.{svg}',
      'dist/css/*.css',
      'dist/js/*.js',
    ],

    dynamicUrlToDependencies: getDynamicDependencies(),

    stripPrefixMulti: {
      'source/images': config.ASSETS_ROOT_DIR + '/images',
      'source/svgs': config.ASSETS_ROOT_DIR + '/svgs',
      'source/fonts': config.ASSETS_ROOT_DIR + '/fonts',
      'dist/css': config.ASSETS_ROOT_DIR + '/css',
      'dist/js': config.ASSETS_ROOT_DIR + '/js'
    },

    // RUNTIME CACHING:
    // - google fonts (cacheFirst)
    // - remaining images (cacheFirst)
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(gstatic|googleapis)\.com/,
        handler: 'cacheFirst'
      },
      {
        urlPattern: /\/(home)\/.*\.(jpg|png)/,
        handler: 'cacheFirst'
      }]
  };

  swPrecache.write(path.join(config.SW_FILE_FOLDER, config.SW_FILE_NAME), swConfig, callback);
});



// Add md5 hash to precacheConfig files that are fingerprinted static assets.
gulp.task('rename-service-worker', function() {
  return gulp.src([path.join(config.SW_FILE_FOLDER, config.SW_FILE_NAME)])
    .pipe(insert.transform(function(contents) {
      // Rename precached files, appending their hash to their filename.
      // This has to done after the SW generation, because Grow appends the
      // dynamically when those files are served.
      var precacheConfig = JSON.parse(contents.match(/\[\[.*\]\]/g));
      var replacements = {};
      precacheConfig.forEach(function(resource) {
        if (resource[0].indexOf(config.ASSETS_ROOT_DIR) >= 0) {
          replacements[resource[0]] =
              resource[0].replace(/(\.min)?(\.(png|jpg|css|js))/, '-' + resource[1] + '$1$2');
        }
      });

      Object.keys(replacements).forEach(function(filepath) {
        contents = contents.replace(filepath, replacements[filepath]);
      });

      return contents;

    }))
    .pipe(gulp.dest(config.SW_FILE_FOLDER));
});



gulp.task('sw', function(callback) {
  return runSequence(
    'generate-service-worker',
    'rename-service-worker',
    callback
  );
});
