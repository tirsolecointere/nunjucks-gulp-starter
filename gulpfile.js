var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    // uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    // imagemin = require('gulp-imagemin'),
    nunjucksRender = require('gulp-nunjucks-render'),
    // htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat');

// Static Server + watching scss/js/html files.
gulp.task('serve', ['sass', 'compressJs', 'nunjucks-html-watch', 'compressImage'], function () {
    browserSync.init({
        server: './build'
    });

    gulp.watch('src/assets/sass/*.sass', ['sass']);
    gulp.watch('src/assets/js/*.js', ['compressJs']);
    gulp.watch('src/assets/img/*', ['compressImage']);
    gulp.watch('./**/*.html', ['nunjucks-html-watch'])
});

// Sass task.
gulp.task('sass', function () {
    return gulp.src('src/assets/sass/*.sass')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(browserSync.stream());
});

// Js task.
gulp.task('compressJs', function () {
    return gulp.src('src/assets/js/*.js')
        // .pipe(uglify())
        .pipe(gulp.dest('./build/assets/js'))
});

// Images task.
gulp.task('compressImage', function () {
    return gulp.src('src/assets/img/**')
        // .pipe(imagemin({
        //     progressive: true,
        //     optimizationLevel: 3
        // }))
        .pipe(gulp.dest('./build/assets/img'))
});

// Nunjucks task.
gulp.task('nunjucks', function () {
    return gulp.src('src/pages/**/*.+(html|nunjucks)')
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        // .pipe(htmlmin({
        //     collapseWhitespace: true,
        //     removeComments: true
        // }))
        .pipe(gulp.dest('./build'))
});

// Create a task that ensures the `nunjucks` task is complete before reloading browsers.
gulp.task('nunjucks-html-watch', ['nunjucks'], function () {
    browserSync.reload();
});


// Vendor scripts tasks.
gulp.task('vendors-scripts', function () {
    return gulp.src([
        './node_modules/jquery/dist/jquery.min.js'])
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('./build/assets/js/'));
});

// Copyfiles task.
gulp.task('copy-files', function () {
    gulp.src([
        'src/config/web.config'
    ])
    .pipe(gulp.dest('./build'));
});

// Compile project.
gulp.task('build-project',
    ['sass', 'compressImage', 'compressJs', 'nunjucks', 'vendors-scripts', 'copy-files']);

// Compile and start project.
gulp.task('default', ['build-project', 'serve']);