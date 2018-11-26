let gulp = require('gulp'),
    sync = require('browser-sync'),
	uglify = require('gulp-uglify-es').default,
    base = 'web';

gulp.task('livereload', function() {
    sync({
        server: {
            baseDir: base
        },
        open: false,
        port: 8080,
        notify: false
    });

    gulp.watch(`${base}/**/*`, sync.reload);
});

gulp.task('minify', function() {
	return gulp.src('production/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('mini-production'));
});