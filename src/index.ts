import * as esm from "./esm";
import * as cjs from "./cjs";
import * as path from "node:path";
type BuildOptions = {
	target: string;
	esmFolder: string;
	cjsFolder: string;
	buildFolder: string;
}

export const build = async (options?: BuildOptions) => {
	const defaultOptions = {
		target: "es2020",
		esmFolder: "esm",
		cjsFolder: "cjs",
		buildFolder: "dist"
	};

	const { target, esmFolder, cjsFolder, buildFolder } = {
		...defaultOptions,
		...options
	};

	console.log("Building...");

	await Promise.all([
		esm.Builder.compile(path.resolve(buildFolder, esmFolder), target),
		cjs.Builder.compile(path.resolve(buildFolder, cjsFolder), target)
	]);
	console.log(`Build completed. Output directory: ${buildFolder}`);
};
