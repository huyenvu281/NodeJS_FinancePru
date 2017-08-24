// --------------------------------------------------
// [Gulpfile]
// --------------------------------------------------

'use strict';
 
var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	changed 	= require('gulp-changed'),
	cleanCSS 	= require('gulp-clean-css'),
	rtlcss 		= require('gulp-rtlcss'),
	rename 		= require('gulp-rename'),
	uglify 		= require('gulp-uglify'),
	htmlhint  	= require('gulp-htmlhint');


// Gulp plumber error handler
function errorLog(error) {
	console.error.bind(error);
	this.emit('end');
}


// --------------------------------------------------
// [Libraries]
// --------------------------------------------------

// Sass - Compile Sass files into CSS
gulp.task('sass', function () {
	gulp.src('./public/sass/**/*.scss')
		.pipe(changed('./public/css/'))
		.pipe(sass({ outputStyle: 'expanded' }))
		.on('error', sass.logError)
		.pipe(gulp.dest('./public/css/'));
});


// Minify CSS
gulp.task('minify-css', function() {
	// Theme
    gulp.src(['./public/css/layout.css', '!./public/css/layout.min.css'])
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/css/'));

    // RTL
    gulp.src(['./public/css/layout-rtl.css', '!./public/css/layout-rtl.min.css'])
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/css/'));
});


// RTL CSS - Convert LTR CSS to RTL.
gulp.task('rtlcss', function () {
	gulp.src(['./public/css/layout.css', '!./public/css/layout.min.css', '!./public/css/layout-rtl.css', '!./public/css/layout-rtl.min.css'])
	.pipe(changed('./public/css/'))
		.pipe(rtlcss())
		.pipe(rename({ suffix: '-rtl' }))
		.pipe(gulp.dest('./public/css/'));
});


// Minify JS - Minifies JS
gulp.task('uglify', function (cb) {
  	pump([
	        gulp.src(['./public/js/**/*.js', '!./public/js/**/*.min.js']),
	        uglify(),
			rename({ suffix: '.min' }),
	        gulp.dest('./public/js/')
		],
		cb
	);
});


// Htmlhint - Validate HTML
gulp.task('htmlhint', function() {
	gulp.src('./public/*.html')
		.pipe(htmlhint())
		.pipe(htmlhint.reporter())
	  	.pipe(htmlhint.failReporter({ suppress: true }))
});


// --------------------------------------------------
// [Gulp Task - Watch]
// --------------------------------------------------

// Lets us type "gulp" on the command line and run all of our tasks
gulp.task('default', ['sass', 'minify-css', 'rtlcss', 'uglify', 'htmlhint', 'watch']);

// This handles watching and running tasks
gulp.task('watch', function () {
    gulp.watch('./public/sass/**/*.scss', ['sass']);
    gulp.watch('./public/css/layout.css', ['minify-css']);
    gulp.watch('./public/css/layout.css', ['rtlcss']);
    gulp.watch('./public/js/**/*.js', ['uglify']);
});