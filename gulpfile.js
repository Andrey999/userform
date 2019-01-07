const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat'); // конкатенация файлов в один
const autoprefixer = require('gulp-autoprefixer'); // автопрефиксы
const cleanCSS = require('gulp-clean-css'); // сжатие стилей
const uglify = require('gulp-uglify');// сжатие  js
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require('browser-sync').create(); // авто перезагрузка
const del = require('del');

sass.compiler = require('node-sass');


const sassAllFiles = [
    'node_modules/normalize.css/normalize.css',
    './src/scss/style.scss'
];

function sassStyles() {
    return gulp.src(sassAllFiles) // ** -  './src/scss/**/*.scss' искать во всех папках, с расширением scss
        .pipe(sourcemaps.init()) // инициализация sourcemaps перед началом компиляции
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concat('all.css')) // конкатенация файлов в один
        .pipe(autoprefixer({
            browsers: ['> 0.1%'], // браузеры которые используются больше 0.1%
            cascade: false
        }))
        .pipe(cleanCSS({ level: 2 })) // сжатие стилей
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

const jsFiles = [
    './src/js/main.js'
]

function scripts() {
    return gulp.src(jsFiles)
        .pipe(concat('all.js')) // конкатенация файлов в один
        .pipe(uglify({
            toplevel: true  // сжатие
        }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}


function watch() {
        browserSync.init({  //инициализация синхронизации
            server: {
                baseDir: "./"  // указываем в какой папке искать наш файл index.html
            }
            // tunnel: true
        });

    gulp.watch('./src/scss/**/*.scss', sassStyles)
    gulp.watch('./src/js/**/*.js', scripts)
    gulp.watch('./*.html',  browserSync.reload)
}

function clean() {
    return del(['build/*'])
}



gulp.task('sassStyles', sassStyles)
gulp.task('scripts', scripts)
gulp.task('watch', watch)
gulp.task('build', gulp.series( clean, //series- последовательность действий
    gulp.parallel(sassStyles, scripts)))  //parallel- все запускается одновременно

gulp.task('dev', gulp.series('build', 'watch'))





















//  если нужен чистый scss
// const cssAllFiles = [
//     'node_modules/normalize.scss/normalize.scss',
//     './src/scss/header.scss',
//     './src/scss/style.scss'
// ];
//
// function styles() {
//     return gulp.src(cssAllFiles) // ** -  './src/scss/**/*.scss' искать во всех папках, с расширением scss
//         .pipe(concat('all.scss')) // конкатенация файлов в один
//         .pipe(autoprefixer({
//             browsers: ['> 0.1%'], // браузеры которые используются больше 0.1%
//             cascade: false
//         }))
//         .pipe(cleanCSS({ level: 2 })) // сжатие стилей
//         .pipe(gulp.dest('./build/scss'))
//         .pipe(browserSync.stream());
// }