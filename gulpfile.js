var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'),
    fileinc = require('gulp-file-include'),
    clean = require('gulp-clean'),
    server =  require('gulp-server-livereload'),
    babel =  require('gulp-babel');

gulp.task('clean', function() {
    return gulp.src('./dist')
        .pipe(clean());
});

gulp.task('server', function () {
    gulp.src('dev').pipe(server({
        livereload: true,
        directoryListing: true,
        open: true,
        port: 5001,
        defaultFile: 'index.html'
    }));
});


gulp.task('production',['clean'],function(){

    gulp.src("./src/*.html")
        .pipe(fileinc({
            prefix: '@@',
            basepath: '@file'
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('./dist'));

    gulp.src('./src/sass/*.sass')
        .pipe(compass({
            config_file: './config.rb',
            css: 'css',
            sass: 'sass'
        }))
        .pipe(gulp.dest('app/assets/temp'))
        .on('error', gutil.log);

    gulp.src(['./src/img/**/**/*.png','./src/img/**/**/*.jpg'], {cwd: './'})
        .pipe(gulp.dest('./dist/img'));

    gulp.src('./src/js/**/**/*js', {cwd: './'})
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('images', function () {
   return watch(['./src/img/**/**/*.png','./src/img/**/**/*.jpg'],function () {
       gulp.src(['./src/img/**/**/*.png','./src/img/**/**/*.jpg'], {cwd: './'})
           .pipe(gulp.dest('./dev/img'));
   });
});

gulp.task('img-cpy', function () {
    return gulp.src(['./src/img/**/**/*.png','./src/img/**/**/*.jpg'], {cwd: './'})
        .pipe(gulp.dest('./dev/img'));
});

gulp.task('scripts', function () {
   return watch('./src/js/*.js', function () {
       gulp.src('./src/js/*.js')
           .pipe(babel({
               presets: ['es2015']
           }))
           .on('error', gutil.log)
           .pipe(gulp.dest('./dev/js'));
   });
});

gulp.task('fileinc', function() {
    return watch('./src/**/*.html', function() {
        gulp.src("./src/*.html")
            .pipe(fileinc({
                prefix: '@@',
                basepath: '@file'
            }))
            .on('error', gutil.log)
            .pipe(gulp.dest('./dev'));
    })
});

gulp.task('compass', function() {
    return watch('./src/sass/**/*.sass', function() {
        gulp.src('./src/sass/*.sass')
            .pipe(compass({
                config_file: './config.rb',
                css: './dev/css',
                sass: './src/sass'
            }))
            //.pipe(gulp.dest('app/assets/temp'))
            .on('er', gutil.log)
            .on('error', gutil.log);
    })
});


gulp.task('default',function() {
    gulp.run('compass');
    gulp.run('fileinc');
    gulp.run('scripts');
    gulp.run('images');
    gulp.run('server');
});