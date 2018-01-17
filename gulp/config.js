const YAML = require('yamljs');

const podspec = YAML.load('./podspec.yaml');

module.exports = {
  ROOT: podspec.root,
  BUILD: `./build${podspec.root}/`,
  JS_SOURCE_DIR: './source/js/composite/',
  THIRD_PARTY_JS: [
    './bower_components/waypoints/lib/noframework.waypoints.min.js',
    './bower_components/waypoints/lib/shortcuts/inview.min.js'
  ],
  POLYFILLS_JS: [
    './source/js/polyfills/*.js',
  ],
  JS_SOURCES: [
    './views/partials/**/*.js',
    './views/common/**/*.js',
    './source/js/libs/*.js',
    './source/js/composite/**/*.js'
  ],
  JS_OUT_DIR: './dist/js/',
  JS_OPTIONS: {
    uglify: {
      mangle: false
    }
  },
  HTML_DIST: `./build${podspec.root}/**/*.html`,
  SASS_SOURCE_DIR: './source/sass/composite/**/*.scss',
  SASS_SOURCES: [
    './views/partials/**/*.scss',
    './views/macros/**/*.scss',
    './views/pages/**/*.scss',
    './views/templates/**/*.scss',
    './views/common/**/*.scss',
    './source/sass/composite/**/*.scss',
    './source/sass/common/**/*.scss',
  ],
  SASS_OUT_DIR: './dist/css/',
  ASSETS_ROOT_DIR: podspec.root,
  SW_FILE_FOLDER: './source/service-worker',
  SW_FILE_NAME: 'service-worker.js',
  SOURCE_PREFIX: '/source/',
  SVG_SOURCES: './source/svgs/'
};
