import {Command} from "../command";
import {toEsm} from "./cjs-to-esm";

export const compile = async (outDir: string, target: string) => {
	const options = [
		`--outDir ${outDir}`,
		`--target ${target}`,
		"--module esnext",
		"--declaration",
		"--moduleResolution node"
	].join(" ");

	const commandLine = `npx tsc ${options}`;
	const command = new Command(commandLine);
	await command.getPromise();
	console.log("Compiling to ESM completed.");
	await toEsm(outDir);
	console.log("Converting to ESM completed.");
};
