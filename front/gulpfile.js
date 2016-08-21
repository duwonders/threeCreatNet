var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require('browser-sync'),
    base64 = require('gulp-base64');

var reload = browserSync.reload;

var base64Conf = {
  src:  './src/html/*.html',
  dest:  './dist/html/*.html',
  options: {
    baseDir: './src',
    extensions: ['png','jpg','jpeg'],
    maxImageSize: 100 * 1024, // bytes
    debug: false
  }
}


var files = {
    source: './src/**/*.*',
    product: './dist/**/*.*',
    base: "./dist",
    src: {
        html: './src/html/*.html',
        js: ['./src/js/index.js', './src/js/login.js'],
        less: './src/styles/*.less',
        css: './src/styles/*.css',
        imgs: './src/imgs/*.*'
    },
    dist: {
        html: './dist/html',
        js: './dist/js/',
        less: './dist/less/',
        css: './dist/styles/',
        imgs: './dist/imgs/'
    }
};

/* 项目目录结构, 可以自行修改 */

gulp.task('less-task', function() {
    return gulp.src(files.src.less)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(files.dist.less))
        .pipe(gulp.dest('./src/styles'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('css-task', function () {
    return gulp.src(files.src.css)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(files.dist.css))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('base64', function(){
    return gulp.src(base64Conf.src)
        .pipe(base64(base64Conf.options))
        .pipe(gulp.dest(base64Conf.dest));
});

gulp.task('babel', function() {
    return gulp.src(files.src.js)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(files.dist.js))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('html', function() {
    return gulp.src(files.src.html)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(files.dist.html))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('img-min', function() {
    return gulp.src(files.src.imgs)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(files.dist.imgs))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: files.base
        }
    });
    /*
     *   访问是通过 html 文件的目录
     * */
    gulp.watch([files.src.html], ['html']);
    gulp.watch([files.src.js], ['babel']);
    gulp.watch([files.src.less], ['less-task']);
    gulp.watch([files.src.imgs], ['img-min']);
    gulp.watch([files.src.css], ['css-task']);
});

gulp.task('watch', function () {
    gulp.watch([files.src.html], ['html']);
    gulp.watch([files.src.js], ['babel']);
    gulp.watch([files.src.less], ['less-task']);
    gulp.watch([files.src.imgs], ['img-min']);
    gulp.watch([files.src.css], ['css-task']);
});

gulp.task('init-project', ['less-task', 'css-task', 'babel', 'html', 'img-min']);

/*
 *   @params
 *       babel 转码 es6 => es5
 *       uglify 压缩js
 *       less 编译 less
 *       autoprefixer 加 css 前缀
 *       cssmin 压缩 css
 *       htmlmin 压缩 html
 *       imagemin 压缩图片
 *       pngquant 配合 imagemin
 *       browser-sync 浏览器同步
 * */