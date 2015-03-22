var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var source = require('vinyl-source-stream');
var globalShim = require('browserify-global-shim');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var config = require('./buildConfig.json');
var Utils = require('./buildUtils.js');


function build(isDev, fileConfig) {
    console.log('build', isDev, fileConfig);
    var props = watchify.args;
    props.entries = [fileConfig.file];
    props.debug = isDev;
    props.standalone = fileConfig.standaloneName;

    var bundler = isDev ? watchify(browserify(props)) : browserify(props);
    bundler.transform(reactify);
    bundler.transform(globalShim.configure(Utils.createGlobalShimConfig(fileConfig, config)));
    bundler.ignore('react');

    function rebundle() {
        var stream = bundler.bundle();
        return stream
            .on('error', notify.onError({
                title: 'Compile Error',
                message: '<%= error.message %>'
            }))
            .pipe(source(Utils.capitalize(fileConfig.name) + '.js'))
            .pipe(gulp.dest(config.distPath));
    }

    bundler.on('update', function () {
        var start = new Date();
        console.log('Rebundling ', fileConfig.name);
        rebundle();
        console.log('Rebundled in ' + (new Date() - start) + 'ms');
    });
    return rebundle();
}

function createFJSFile() {
    var location = './node_modules/f-js/lib/';
    var files = ['promises.js', 'P.js', 'F.js', 'F.stream.js', 'exports.js'].map(function (file) {
        return location + file;
    });
    console.log('Creating F-js file of ', files, config.srcPath);
    return gulp.src(files)
        .pipe(concat('index.js'))
        .pipe(gulp.dest(config.srcPath + 'f-js/'));

}

function uglifyTask(componentName) {
    var file = config.distPath + '/' + componentName + '.js';
    console.log('Uglifying ', file);
    gulp.src(file)
        .pipe(uglify())
        .pipe(rename(componentName + '.min.js'))
        .pipe(gulp.dest(config.distPath));
}

gulp.task('dev', function () {
    createFJSFile();
    config.components
        .map(Utils.createComponentConfig.bind(this, config.srcPath, config.namespace.components))
        .forEach(build.bind(this, true));
});

gulp.task('default', function () {
    createFJSFile();
    config.components
        .map(Utils.createComponentConfig.bind(this, config.srcPath, config.namespace.components))
        .forEach(build.bind(this, false));

    config.components
        .map(Utils.capitalize)
        .map(uglifyTask);
});