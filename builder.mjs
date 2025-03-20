#!/usr/bin/env node
import {build} from "./dist/esm/index.mjs";
import arg from "arg";

const args = arg({
	"--target": String,
	"--buildFolder": String,
	"--esmFolder": String,
	"--cjsFolder": String,
	"--help": Boolean,
	"-h": "--help",
	"-t": "--target",
	"-e": "--esmFolder",
	"-c": "--cjsFolder"
});

const target = args["--target"] ?? "es2020";
const buildFolder = args["--buildFolder"] ?? "dist";
const esmFolder = args["--esmFolder"] ?? "esm";
const cjsFolder = args["--cjsFolder"] ?? "cjs";

if (args["--help"]) {
	console.log(`
	Usage: build [options]

	Options:
	  --buildFolder  Specify the target directory for the build (default: dist)
	  --esmFolder    Specify the target directory for the ESM build (default: esm)
	  --cjsFolder    Specify the target directory for the CJS build (default: cjs)
	  --target       Specify the target ECMAScript version (default: es2020)
	  --help    Show this help message
	`);
	process.exit(0);
}

build({
	target,
	buildFolder,
	esmFolder,
	cjsFolder
}).then(() => {
	console.log("Build completed successfully.");
}).catch((error) => {
	console.error("Build failed:", error);
	process.exit(1);
});
