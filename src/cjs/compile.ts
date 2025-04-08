import {Command} from "../command/index";
import {toDts} from "../type-only-files";

export const compile = async (outDir: string, target: string) => {
	const options = [
		`--outDir ${outDir}`,
		`--target ${target}`,
		"--module CommonJS",
		"--moduleResolution Node",
		"--declaration",
	].join(" ");

	const commandLine = `npx tsc ${options}`;
	const command = new Command(commandLine);
	await command.getPromise();
	await toDts(outDir);
	console.log("Compiling to CJS completed.");
};
