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
	watch  = require('gulp-watch');

gulp.task('sass', function(){
		return gulp.src('components/scss/styles.scss')
			.pipe(sass().on('error', sass.logError))
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

gulp.task('uglify-angular', function(){
		return gulp.src(['public_app/**/*.js', '!/public_app/app.min.js'])
			.pipe(concat('app.min.js'))
			.pipe(uglify({
				mangle: false
				}).on('error', function(err){
					console.log(err);
					process.stdout.write('\x07');
				}))
			.pipe(gulp.dest('public_app'))
			.pipe(livereload());
	});

gulp.task('admin-uglify-angular', function(){
		return gulp.src(['admin/admin_app/**/*.js', '!admin/admin_app/app.min.js'])
			.pipe(concat('app.min.js'))
			.pipe(uglify({
				mangle: false
				}).on('error', function(err){
					console.log(err);
					process.stdout.write('\x07');
				}))
			.pipe(gulp.dest('admin/admin_app'))
			.pipe(livereload());
	});

gulp.task('server', function(){
		gulp.src('../public')
			.pipe(livereloadServer({
					livereload:true,
					port:8000,
					open:true
				}));
	});

gulp.task('html', function(){
		gulp.src('*.html')
			.pipe(livereload());
	})


gulp.task('watch', function(){
		livereload.listen({
				port:8000,
				host:'devCodeMusic.dev'
			});
		gulp.watch('**/*.html', ['html']);
		gulp.watch('components/scss/*.scss', ['sass']);
		gulp.watch('components/js/*.js', ['uglify-script']);
		gulp.watch(['public_app/**/*.js', '!public_app/app.min.js'], ['uglify-angular']);
		gulp.watch(['admin/admin_app/**/*.js', '!admin/admin_app/app.min.js'], ['admin-uglify-angular']);
	});

gulp.task('default', ['server','sass','uglify-script','uglify-angular', 'admin-uglify-angular', 'watch']);