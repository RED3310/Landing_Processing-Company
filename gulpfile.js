
let project_folder = "dist";
let sourse_folder = "src";

let path = {
    build: {
        pug: project_folder + "/",
        css: project_folder + "/style",
        js: project_folder + "/js",
        img: project_folder + "/images",
    },
    src: {
        pug: sourse_folder + "/pug/pages/*.pug",
        css: sourse_folder + "/sass/index.scss",
        js: sourse_folder + "/js/script.js",
        img: sourse_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    watch: {
        pug: sourse_folder + "/**/*.pug",
        css: sourse_folder + "/sass/**/*.scss",
        js: sourse_folder + "/js/**/*.js",
        img: sourse_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp');
let gulp = require('gulp');

let browsersync = require('browser-sync').create();
let pug = require('gulp-pug');
let sass = require('gulp-sass')(require('sass'));
let fileinclude = require('gulp-file-include');
let babel = require('gulp-babel');
//let autoprefixer = require('gulp-autoprefixer');

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function images() {
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function pugHtml() {
    return src(path.src.pug)
        .pipe(fileinclude())
        .pipe(pug({ pretty: true }))
        .pipe(dest(path.build.pug))
        .pipe(browsersync.stream())
}

function style() {
    return src(path.src.css)
        .pipe(fileinclude())
        //.pipe(autoprefixer({ cascade: false }))
        .pipe(sass().on('error', sass.logError))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function scripts() {
    return src(path.src.js)
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function watchFiles() {
    gulp.watch([path.watch.pug], pugHtml)
    gulp.watch([path.watch.css], style)
    gulp.watch([path.watch.js], scripts)
}

let build = gulp.series(pugHtml, style, scripts, images);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.scripts = scripts;
exports.style = style;
exports.pugHtml = pugHtml;
exports.build = build;
exports.watch = watch;
exports.default = watch;

