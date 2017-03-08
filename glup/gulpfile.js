var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var sass   = require('gulp-sass');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var notify = require("gulp-notify");  //错误处理
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var reload = browserSync.reload;

var www='./elfinbook';       //根目录
var path_watch=www;            // watch文件变化的目录
var origin_css;            //   源css文件目录
var origin_scss=www+'/assets/scss';           //   源scss文件目录
var target_scss=www+'/assets/scss_to_css';           //   编译之后存放的位置
var target_css;           //    css压缩之后存放的位置

var origin_js;             //  需要处理的js目录 
var target_js;             // 压缩之后的js目录

function handleErrors(){
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'compile error',
    message: '<%=error.message %>'
  }).apply(this, args);//替换为当前对象
  this.emit();//提交 
}
     
gulp.task('min', ['sass'],function () {
    gulp.src(origin_css+"/*.css")
    .pipe(cssmin())
    .pipe(gulp.dest(target_css));
    gulp.src(origin_js+"/*.js")
        .pipe(stripDebug().on('error', function(e) {
            console.log(e);
         }))
        .pipe(uglify().on('error', function(e) {
            console.log(e);
         }))
        .pipe(gulp.dest(target_js));
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir:www.slice(2),     // 静态服务器
            directory: true
        },
        // proxy: "localhost:8080",
        // port: 4000 // specify a different port for browser-sync, default is 3000
    });
    gulp.watch(origin_scss+"*.scss", ['sass']);
    // gulp.watch(path_watch+"/**").on('change', reload);
});

// scss编译后的css将注入到浏览器里实现更新
gulp.task('sass', function() {
    return gulp.src(origin_scss+"/*.scss")
        .pipe(sass())
         .on('error', handleErrors) 
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest(target_scss))
        .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);
