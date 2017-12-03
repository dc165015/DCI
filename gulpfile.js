var gulp = require('gulp');
// gulp.task('default', ['tslint', 'tsc']);

var tslint = require('gulp-tslint');
gulp.task('tslint', function(){
    return gulp.src(['./test/**/**.test.ts']).pipe(tslint.default());
});

var ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json', {
    module:'commonjs',
    target:'es2017',
    removeComments: true,
});

gulp.task('tsc', function(){
    return gulp.src('./src/ts/**/**.ts').pipe(ts(tsProject)).js.pipe(gulp.dest('./temp/src/js'));
});

var tsTestProject = ts.createProject('ts-test-config.json', {
    removeComments:true,
    noImplicitAny:true,
    target: 'es2017',
    module:'commonjs',
    declarationFiles: false
});

gulp.task('tsc-tests',function(){
    return gulp.src('./test/**/**.ts').pipe(ts(tsTestProject)).js.pipe(gulp.dest('./temp/test/'));
});


var browersify = require('browserify'),
    transform = require('vinyl-transform'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

var browersified = transform(function(filename){
    var b = browersify({entries:filename, debug:true});
    return b.bundle();
});    

gulp.task('bundle-js', function(){
    return gulp.src('./temp/src/js/main.js')
    .pipe(browersified)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./', {}))
    .pipe(gulp.dest('./dist/src/js/'));
});

gulp.task('bundle-test', function(){
    return gulp.src('./temp/test/**/**.test.js')
    .pipe(browersified)
    .pipe(gulp.dest('./dist/test/'));
});
    
gulp.series(['tslint', 'tsc', 'tsc-tests', 'bundle-js', 'bundle-test']);

var karma=require()