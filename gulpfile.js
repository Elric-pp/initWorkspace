var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');
connect = require('gulp-connect');

gulp.task('style', function() {
    return sass('src/style/main.scss', {
            style: 'expanded'
        })
        //return gulp.src('src/style/main.scss')
        //.pipe(sass({style:'expanded'}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest('dist/style'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/style'))
        .pipe(connect.reload())
        .pipe(notify({
            message: 'Style task complete'
        }));
})

gulp.task('script', function() {
    return gulp.src('src/script/**/*.js')
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/script/'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/script'))
        .pipe(connect.reload())
        .pipe(notify({
            message: 'script task complete'
        }));
});

gulp.task('image', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(connect.reload())
        .pipe(notify({
            message: 'image task complete'
        }));
});

gulp.task('html', function() {
    return gulp.src('dist/**/*.html')
        .pipe(connect.reload())
});

gulp.task('clean', function() {
    return gulp.src(['dist/style', 'dist/script', 'dist/images'], {
            read: false
        })
        .pipe(clean());
});



gulp.task('watch', function() {
    gulp.watch('src/style/*.scss', ['style']);

    gulp.watch('src/script/**/*.js', ['script']);

    gulp.watch('src/images/**/*', ['image']);

    gulp.watch('**/*.html', ['html']);
});


gulp.task('connect', function() {
    connect.server({
        //root:'angular-to-do-list',
        livereload: true
    });
});


gulp.task('default', ['clean'], function() {
    gulp.start('style', 'script', 'image');
    gulp.start('watch');
    gulp.start('connect');
})
