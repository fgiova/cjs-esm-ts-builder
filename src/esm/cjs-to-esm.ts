/* eslint-disable @typescript-eslint/no-unused-vars */
import * as path from "node:path";
import * as fs from "node:fs/promises";

const relativePath = async (sourceFile: string, targetFile: string) => {
	targetFile = targetFile.trim().slice(1, targetFile.length - 1).replace(".js", "");
	const sourceDir = path.dirname(sourceFile);
	const targetElement= path.resolve(sourceDir, `${targetFile}`);
	try {
		const stat = await fs.stat(targetElement);
		if(stat.isDirectory()) {
			return `${targetFile}/index`;
		}
		return null;
	}
	catch (e){}
	try {
		const stat = await fs.stat(`${targetElement}.js`);
		if(stat.isFile()) {
			return targetFile;
		}
		return null;
	}
	catch (e) {}
	try {
		const stat = await fs.stat(`${targetElement}.mjs`);
		if(stat.isFile()) {
			return targetFile;
		}
		return null;
	}
	catch (e) {
		return null;
	}
};

const replaceInlineImports = async (content: string, sourceFile: string): Promise<string> => {
	const pattern = /import\((.*?)\)/g;

	while (true) {
		const match = pattern.exec(content);

		if (match === null) {
			return content;
		}

		const importDeclaration = match[1];
		const importModule = await relativePath(sourceFile, importDeclaration);
		if (!importModule) {
			continue;
		}
		content = content.replace(importDeclaration, `"${importModule}.mjs"`);
	}
};

const replaceExportImportDeclarations = async (content: string, sourceFile: string): Promise<string> => {
	const pattern = /(export|import)(.*) from ("(.*)");/g;

	while (true) {
		const match = pattern.exec(content);

		if (match === null) {
			return content;
		}

		const declaration = match[3];
		const importModule = await relativePath(sourceFile, declaration);
		if (!importModule) {
			continue;
		}
		content = content.replace(declaration, `"${importModule}.mjs"`);
	}
};

const replaceDirname = (content: string): string => {
	return content.replaceAll(/(?<!\))__dirname(?!\()/g, "import.meta.dirname")
		.replaceAll(/(?<!\))__filename(?!\()/g, "import.meta.filename");
}

const replaceDeclarations = async (content: string, sourceFile: string): Promise<string> => {
	return await replaceInlineImports(
		await replaceExportImportDeclarations(
			replaceDirname(content),
			sourceFile
		),
		sourceFile
	);
};

const fileIsProcessable = (sourcepath: string) => {
	const extname = path.extname(sourcepath);
	return [".js", ".ts"].includes(extname);
};

const esmExtension = (extension: string) => {
	return (
		extension === ".js" ? ".mjs" :
		extension === ".ts" ? ".mts" :
		extension
	);
};

const processFile = async (sourceFile: string) => {
	if(!fileIsProcessable(sourceFile)) {
		return;
	}

	const extname = path.extname(sourceFile);
	const dirname = path.dirname(sourceFile);
	const basename = path.basename(sourceFile, extname);

	const newExtname = esmExtension(extname);
	const sourceContent = await fs.readFile(sourceFile, "utf-8");
	const newContent = replaceDeclarations(sourceContent, sourceFile);

	const newFile = `${path.join(dirname, basename)}${newExtname}`;

	await fs.writeFile(newFile, await newContent);
	await fs.unlink(sourceFile);
};

const processDirectory = async (directory: string) => {
	const files = await fs.readdir(directory);
	for (const file of files) {
		const elementPath = path.join(directory, file);
		await processElement(elementPath);
	}
};

const processElement = async (sourcePath: string) => {
	const element = await fs.stat(sourcePath);

	if(element.isDirectory()) {
		return await processDirectory(sourcePath);
	}
	if(element.isFile()) {
		return await processFile(sourcePath);
	}
};

export const toEsm = async (sourceDirectory: string) => {
	await processElement(sourceDirectory);
};
