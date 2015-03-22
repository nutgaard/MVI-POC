var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var source = require('vinyl-source-stream');
var globalShim = require('browserify-global-shim');
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

    if (fileConfig.name !== 'react') {
        bundler.transform(globalShim.configure(Utils.createGlobalShimConfig(fileConfig, config)));
        bundler.ignore('react');
    }

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

gulp.task('dev', function () {
    build(true, {
        file: config.srcPath + "react.js",
        namespace: config.namespace.base,
        name: "react",
        standaloneName: Utils.createStandaloneName(config.namespace.base, "react")
    });
    config.components
        .map(Utils.createComponentConfig.bind(this, config.srcPath, config.namespace.components))
        .forEach(build.bind(this, true));
})

gulp.task('default', function () {
    build(false, {
        file: config.srcPath + "react.js",
        namespace: config.namespace.base,
        name: "react",
        standaloneName: Utils.createStandaloneName(config.namespace.base, "react")
    });
    config.components
        .map(Utils.createComponentConfig.bind(this, config.srcPath, config.namespace.components))
        .forEach(build.bind(this, false));
});