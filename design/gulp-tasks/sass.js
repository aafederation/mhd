const { dest, src } = require("gulp");
const cleanCSS = require("gulp-clean-css");
var sassProcessor = require("gulp-sass")(require("sass"));

// We want to be using canonical Sass, rather than node-sass

// Flags wether we compress the output etc
const isProduction = process.env.NODE_ENV === "production";

// The main Sass method grabs all root Sass files,
// processes them, then sends them to the output calculator
const sass = () => {
	return src("./src/scss/*.scss")
		.pipe(sassProcessor().on("error", sassProcessor.logError))
		.pipe(
			cleanCSS(
				isProduction
					? {
							level: 2,
					  }
					: {}
			)
		)
		.pipe(dest("../static/css", { sourceMaps: !isProduction }));
};

module.exports = sass;
