var gulp = require('gulp');
var sass = require('gulp-sass');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

gulp.task('sass', function(){
  return gulp.src('assets/scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('build/css'))
});

gulp.task('scripts', function() {
  return gulp.src([
      'modules/**/js/*.js',
      'assets/js/*.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('templates', function() {
  return gulp.src('modules/**/*.hbs')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'PlayerStatsCardTemplates',
      noRedeclare: true
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/templates'));
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
 
gulp.task('watch', function(){
  gulp.watch(['assets/scss/*.scss', 'modules/**/scss/*.scss'], ['sass']); 
  gulp.watch(['assets/js/**/*.js', 'playerstatscard/js/*.js'], ['scripts']); 
  gulp.watch('playerstatscard/*.hbs', ['templates']);
})

gulp.task('build', ['sass', 'templates', 'scripts']);
gulp.task('default', ['build', 'browser-sync']);
