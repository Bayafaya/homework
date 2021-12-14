const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
const del = require('del');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');


//  server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port:9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

// pug
gulp.task('templates:compile', function buildHTML(){
    return gulp.src('source/template/index.pug')
    .pipe(sourcemaps.init())
    .pipe(
        pug({
        pretty:true
        })
      )
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build'))
  });

  //sass
  gulp.task('sass', function (){
    return gulp.src('source/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
			browsers:['last 2 versions'],
      cascade: false
		}))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'));
  });

  //sprite
 
gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('source/img/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprite.png',
      cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
  });


  //clean
  gulp.task('clean', function (){
    return del('build');
    });





   
    gulp.task('fonts:copy', function (){
    return gulp.src('./source/fonts/**/*.*')
    pipe(gulp.dest('build/fonts'));
    });
  

  gulp.task('copy:img', function (){
    return gulp.src('./source/img/**/*.*')
    pipe(gulp.dest('build/img'));
    });
    

    gulp.task('copy', gulp.parallel('fonts:copy','copy:img')); 






    //watchers
    gulp.task('watch', function (){
gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
gulp.watch('source/styles/**/*.scss', gulp.series('sass'));
    });
    

    gulp.task('default', gulp.series ('clean',
    gulp.parallel('templates:compile','sass','sprite','copy'),
    gulp.parallel('watch','server')
    )
    );
    
    