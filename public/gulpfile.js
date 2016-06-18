'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	util = require('gulp-util'),
	livereload = require('gulp-livereload'),
	livereloadServer = require('gulp-server-livereload'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	beep = require('beepbeep'),
	watch  = require('gulp-watch');

var map = require('map-stream');
var exitOnJshintError = map(function (file, cb) {
  if (!file.jshint.success) {
    console.error('jshint failed');
    process.stdout.write('\x07');
    process.exit(1);
  }
});

util.log('stuff happened', 'Really it did', util.colors.magenta('123'));

gulp.task('sass', function(){
		return gulp.src('components/scss/styles.scss')
			.pipe(sass().on('error', function(){
					sass.logError;
					process.stdout.write('\x07');
				}))
			.pipe(gulp.dest('components'))
			.pipe(livereload());
	});

gulp.task('uglify-script', function(){
		return gulp.src('components/js/*.js')
			.pipe(concat('script.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest('components'))
			.pipe(livereload());
	});

gulp.task('jshint-angular', function(){
		return gulp.src(['apps/public_app/**/*.js', '!apps/public_app/app.min.js'])
			.pipe(jshint().on('error', function(){
				process.stdout.write('\x07');
			}))
			.pipe(jshint.reporter('jshint-stylish'))
			.pipe(exitOnJshintError)
			.pipe(livereload());
	});

gulp.task('uglify-angular', function(){
		return gulp.src(['apps/public_app/**/*.js', '!app/public_app/app.min.js'])
			.pipe(concat('app.min.js'))
			.pipe(uglify({
					mangle: false
				})
				.on('error', function(){
					process.stdout.write('\x07');
				}))
			.pipe(gulp.dest('apps/public_app'))
			.pipe(livereload());
	});

gulp.task('server', function(){
		gulp.src('../public')
			.pipe(livereloadServer({
					livereload:true,
					open:true
				}));
	});

gulp.task('html', function(){
		gulp.src('*.html')
			.pipe(livereload());
	});


gulp.task('watch', function(){
		livereload.listen({
				port:8000,
				host:'devCodeMusic.dev'
			});
		gulp.watch('**/*.html', ['html']);
		gulp.watch('components/scss/*.scss', ['sass']);
		gulp.watch('components/js/*.js', ['uglify-script']);
		gulp.watch(['apps/public_app/**/*.js', '!apps/public_app/app.min.js'], ['jshint-angular', 'uglify-angular']);
	});

gulp.task('default', ['server','sass', 'jshint-angular', 'watch']);

