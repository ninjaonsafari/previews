'use strict';

var gulp = require('gulp'),
	tsc = require('gulp-typescript'),
	tslint = require('gulp-tslint'),
	del = require('del'),
	Config = require('./gulpfile.config'),
	tsProject = tsc.createProject('tsconfig.json'),
	browserSync = require('browser-sync'),
	superstatic = require('superstatic'),
	less = require('gulp-less'),
	lessAutoprefix = require('less-plugin-autoprefix'),
	autoPrefix = new lessAutoprefix({ browsers: ['last 2 versions'] });

var config = new Config();

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
	return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', function () {
    var sourceTsFiles = [config.allTypeScript,                //path to typescript files
                         config.libraryTypeScriptDefinitions]; //reference to library .d.ts files

    var tsResult = gulp.src(sourceTsFiles)
                       .pipe(tsc(tsProject));

	tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
	return tsResult.js.pipe(gulp.dest(config.tsOutputPath));
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
	var typeScriptGenFiles = [
		config.tsOutputPath +'/**/*.js',    // path to all JS files auto gen'd by editor
		config.tsOutputPath +'/**/*.js.map', // path to all sourcemap files auto gen'd by editor
		'!' + config.tsOutputPath + '/lib'
	];

  // delete the files
  del(typeScriptGenFiles, cb);
});

gulp.task('compile-less', function () {
    var sourceLessFiles = config.lessSourceFile;

    var lessResult = gulp.src(sourceLessFiles)
                       .pipe(less({
							plugins: [autoPrefix]
					   }));
					 
	return lessResult.pipe(gulp.dest(config.lessOutputPath));
});

gulp.task('watch', function() {
    gulp.watch([config.allTypeScript], ['ts-lint', 'compile-ts']);
	gulp.watch([config.allLess], ['compile-less']);
});

gulp.task('serve', ['compile-ts', 'compile-less', 'watch'], function() {
  process.stdout.write('Starting browserSync and superstatic...\n');
  browserSync({
	port: 3000,
	files: ['index.html', '**/*.js', '**/*.css'],
	injectChanges: true,
	logFileChanges: false,
	logLevel: 'silent',
	logPrefix: 'previews',
	notify: true,
	reloadDelay: 0,
	server: {
		baseDir: './src',
		middleware: superstatic({ debug: false})
	}
	});
});

gulp.task('default', ['ts-lint', 'compile-ts', 'compile-less']);