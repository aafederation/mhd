var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var buffer = require("vinyl-buffer");
var source = require("vinyl-source-stream");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

// create javascript bundle from here
const jsScripts = () => {
	var pj = "1.2.2";
	return browserify({ entries: "./src/js/hugotagsfilter.js", debug: true })
		.transform("babelify", { presets: ["es2015"] })
		.bundle()
		.pipe(source(`hugotagsfilter-${pj}.js`))
		.pipe(gulp.dest("../static/js"))
		.pipe(buffer())
		.pipe(uglify({ output: { comments: "some" } }))
		.pipe(rename({ extname: ".min.js" }))
		.pipe(gulp.dest("../static/js"));
};

module.exports = jsScripts;
