var gulp = require('gulp');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var inject = require('gulp-inject');
var browserSync = require('browser-sync').create(); //auto open browser and liveload


var config = {
        path: {
            js: './src/js/*.js',
            css: './src/css/*.css'
        },
        build: {
            js: './build/js',
            css: './build/css'
        }
    }
    // 说明
gulp.task('help', function() {
    console.log('	gulp build			项目打包');
    console.log('	gulp watch			文件监控打包');
    console.log('	gulp help			gulp参数说明');
    console.log('	gulp server			测试server');
});
/**=======================js=============================*/
gulp.task('js', ['js:eslint', 'js:compress', 'js:inject'], function() {
    console.log('js done')
        //js校验,合并，压缩，自动注入build index.html
});
gulp.task('js:eslint', function() {
    return gulp.src(config.path.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
});
gulp.task('js:compress', ['js:eslint'], function() {
    return gulp.src(config.path.js)
        .pipe(concat('index.all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.build.js))
});

gulp.task('js:inject', ['js:compress'], function() {
    return gulp.src('src/index.html')
        .pipe(inject(gulp.src('./build/js/*.js', { read: false })))
        .pipe(gulp.dest('./src'))
        .pipe(browserSync.stream())
});
/**======================css==============================*/
gulp.task('css', ['css:inject'], function() {
    return gulp.src(config.path.css)
        .pipe(concat('index.all.css'))
        .pipe(cleanCSS('index.all.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.build.css))
        .pipe(browserSync.stream())
});
gulp.task('css:inject', function() {
    return gulp.src('src/index.html')
        .pipe(inject(gulp.src('./build/css/*.css', { read: false })), { ignorePath: '/build', addRootSlash: true })
        .pipe(gulp.dest('./src'))
});
/**=========================server=========================*/
gulp.task('server', ['js','css'], function() {
    browserSync.init({
        //多个基目录
        server: {
            baseDir: ["./", './src', './build']
        }
    });
    gulp.watch("./src/js/*.js",['js'])
    gulp.watch("./src/css/*.css",['css'])
    gulp.watch("./build/index.html").on("change",browserSync.reload)
});
gulp.task('build', ['watch','server'], function() {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./build'))
})
/**=========================watch=========================*/
gulp.task('watch',function(){
	gulp.watch(config.path.js)
	gulp.watch(config.path.css)
})

/* 默认 */

gulp.task('default', ['build'], function() {
    gulp.start('help');
});
