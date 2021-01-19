const { dest, src } = require("gulp");
const GetGoogleFonts = require("get-google-fonts");

const fonts = async () => {
	// Setup of the library instance by setting where we want
	// the output to go. CSS is relative to output font directory
	const instance = new GetGoogleFonts({
		outputDir: "../static/fonts",
		cssFile: "./fonts.css",
	});

	// Grabs fonts and CSS from google and puts in the dist folder

	//Montserrat + Raleway
	const result = await instance.download(
		"https://fonts.googleapis.com/css?family=Montserrat:wght@0,400;0,700;0,900;1,400;1,700;1,900|Raleway:wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap"
	);

	/*
	//Barlow + Lora
	const result = await instance.download(
		"https://fonts.googleapis.com/css?family=Barlow+Condensed:wght@0,400;0,700;0,900;1,400;1,700;1,900|Lora:wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap"
	);
	*/

	/*
	//Sansita + Oswald
	const result = await instance.download(
		"https://fonts.googleapis.com/css?family=Sansita:wght@0,400;0,700;0,900;1,400;1,700;1,900|Oswald:wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap"
	);
	*/

	return result;
};

module.exports = fonts;
