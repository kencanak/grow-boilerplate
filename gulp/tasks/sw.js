'use strict'

const gulp = require('gulp');
const insert = require('gulp-insert');
const packageJson = require('../../package.json');
const path = require('path');
const runSequence = require('run-sequence');
const swPrecache = require('sw-precache');
const fs = require('fs');

const config = require('../config');

const getDynamicDependencies = (url) => {
  // common dependencies
  let dependencies = [
    'content/pages/_blueprint.yaml',
    'content/pages/articles/_blueprint.yaml',
    'views/base.html',
    'views/common/back-to-top-button/back-to-top-button.html',
    'views/partials/_carousel/_carousel.html',
    'views/partials/_copy-lockup/_copy-lockup.html',
    'views/partials/_diagram/_diagram.html',
    'views/partials/_hero/_hero.html',
    'views/partials/_imageblock/_imageblock.html',
    'views/partials/_intro-paragraph/_intro-paragraph.html',
    'views/partials/_listitem/_listitem.html',
    'views/partials/_quote/_quote.html',
    'views/partials/_share/_share.html',
    'views/partials/_video/_video.html',
    'views/macros/_section/_section.html',
    'views/macros/_image.html',
    'views/templates/article-content/article-content.html',
    'dist/css/main.min.css'
  ];

  dependencies.push('content/pages/articles/article-summer-dandruff.yaml');

  let pageSlug = null;

  if (url.indexOf('articles') > 0) {
    pageSlug = url.split('/')[2];
    dependencies.push('dist/js/article.min.js');
    dependencies.push('dist/css/article.min.css');
  } else if (url.indexOf('article-list') > 0) {
    pageSlug = url.split('/')[2];

    dependencies.push(`content/pages/${pageSlug}.yaml`);


    dependencies.push('dist/js/article-list.min.js');
    dependencies.push('dist/css/article-list.min.css');
  } else {
    dependencies.push('dist/js/article-list.min.js');
    dependencies.push('dist/css/article-list.min.css');
    dependencies.push('content/pages/dandruff.yaml');
  }

  return dependencies;
};

const generateListOfDependencies = () => {
  let dependencies = {};

  dependencies[`${config.ROOT}/index.html`] = getDynamicDependencies('/index.html');
  dependencies[`${config.ROOT}/articles/article-summer-dandruff/index.html`] = getDynamicDependencies('/articles/article-summer-dandruff/');
  dependencies[`${config.ROOT}/articles/article-summer-hair-care/index.html`] = getDynamicDependencies('/articles/article-summer-hair-care/');
  dependencies[`${config.ROOT}/articles/article-sofia-vergara/index.html`] = getDynamicDependencies('/articles/article-sofia-vergara/');
  dependencies[`${config.ROOT}/articles/article-scalp-psoriasis/index.html`] = getDynamicDependencies('/articles/article-scalp-psoriasis/');
  dependencies[`${config.ROOT}/articles/article-head-and-shoulder-supreme/index.html`] = getDynamicDependencies('/articles/article-head-and-shoulder-supreme/');
  dependencies[`${config.ROOT}/dandruff/index.html`] = getDynamicDependencies('/dandruff/');
  dependencies[`${config.ROOT}/hair-care/index.html`] = getDynamicDependencies('/hair-care/');
  dependencies[`${config.ROOT}/itchy-dry-sensitive/index.html`] = getDynamicDependencies('/itchy-dry-sensitive/');
  dependencies[`${config.ROOT}/severe-scalp-conditions/index.html`] = getDynamicDependencies('/severe-scalp-conditions/');

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

    dynamicUrlToDependencies: generateListOfDependencies(),

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
