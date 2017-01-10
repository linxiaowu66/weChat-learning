

const gulp = require('gulp');
const clean = require('gulp-clean');
// const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

const serverDir = 'server';
const buildDir = 'dist';
/**
 * Clean ups ./dist folder
 */
gulp.task('clean', () => gulp
    .src(`${buildDir}`, { read: false })
    .pipe(clean({ force: true }))
    .on('error', log));


function _copyServer() {
  gulp
    .src([`${serverDir}/**/*`,
      `!${serverDir}/controllers`,
      `!${serverDir}/controllers/**`,
      `!${serverDir}/config`,
      `!${serverDir}/config/**`,
      `!${serverDir}/helper`,
      `!${serverDir}/helper/**`,
      `!${serverDir}/models`,
      `!${serverDir}/models/**`,
      `!${serverDir}/routes`,
      `!${serverDir}/service/**`,
      `!${serverDir}/service`,
      `!${serverDir}/routes/**`,
      `!${serverDir}/server.js`,
      `!${serverDir}/MP_verify_7qbDGd8ABvTeLkfb.txt`
    ])
    .pipe(gulp.dest(`${buildDir}/${serverDir}`))
    .on('error', log);
}

function _copyClient() {
  gulp
    .src([`${serverDir}/MP_verify_7qbDGd8ABvTeLkfb.txt`])
    .pipe(gulp.dest(`${buildDir}/`))
    .on('error', log);
}

/**
 * Copy the server folders
 */
gulp.task('copy:server', _copyServer);

/**
 * Copy the weixin verification file to client
 */
gulp.task('copy:client', _copyClient);

/* Server Side compile*/
gulp.task('babel', () => gulp.src([`${serverDir}/**/*.js`])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015', 'es2017'],
      plugins: ['transform-promise-to-bluebird']
    }))
    // .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${buildDir}/${serverDir}`)));


function log(error) {
  console.error(error.toString && error.toString());
}


gulp.task('build-server', ['clean'], () => {
  gulp.start(['babel', 'copy:server', 'copy:client']);
});
