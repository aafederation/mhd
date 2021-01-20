const fs = require("fs");
const tokens = require("./src/design-tokens.json");

const colors = tokens.colors || {};
const fonts = tokens.fonts || {};
const sizes = tokens.sizes || {};

let sass = "";

if (Object.keys(colors).length) {
	sass += `$gorko-colors: (${Object.keys(colors)
		.map(key => `"${key}": ${colors[key]}`)
		.join(",")});\n`;
}

if (Object.keys(fonts).length) {
	sass += `$gorko-fonts: (${Object.keys(fonts)
		.map(key => `"${key}": "${fonts[key]}"`)
		.join(",")});\n`;
}

// Each size is a pixel value, so we divide by 16 (root HTML font size) to get rems
if (Object.keys(sizes).length) {
	sass += `$gorko-size-scale: (${Object.keys(sizes)
		.map(key => key === "auto" ? `"auto":"auto"` : `"${key}": ${(sizes[key] / 16).toFixed(2)}rem`)
		.join(",")});\n`;
}

// Add a message about this being auto-generated
sass = `/// This is auto-generated Sass from ../design-tokens.json\n${sass}`;

// Write Sass out
fs.writeFileSync("src/scss/_tokens.scss", sass, "utf-8");
