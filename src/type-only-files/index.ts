/* eslint-disable @typescript-eslint/no-unused-vars */
import { getTsconfig } from "get-tsconfig";
import * as path from "node:path";
import * as fs from "node:fs/promises";

let baseSourcePath = "";

const processDirectory = async (directorySource: string, directoryDestination: string) => {
    const files = await fs.readdir(directorySource);
    for (const file of files) {
        const elementPath = path.join(directorySource, file);
        await processElement(elementPath, directoryDestination);
    }
};

const fileIsProcessable = (sourcepath: string) => {
    return sourcepath.endsWith(".d.ts");
};

const processFile = async (sourceFile: string, destinationPath: string) => {
    if(!fileIsProcessable(sourceFile)) {
        return;
    }

    const basename = path.basename(sourceFile);
    const sourceContent = await fs.readFile(sourceFile, "utf-8");
    const newFile = `${path.join(destinationPath, basename)}`;

    await fs.writeFile(newFile, sourceContent);
};

const processElement = async (sourcePath: string, destinationPath: string) => {
    const element = await fs.stat(sourcePath);

    if (element.isDirectory()) {
        const newDestination = destinationPath + sourcePath.replace(baseSourcePath, "");
        try {
            await fs.access(newDestination);
        }
        catch (e) {
            await fs.mkdir(newDestination, { recursive: true });
        }
        return await processDirectory(sourcePath, newDestination);
    }
    if (element.isFile()) {
        return await processFile(sourcePath, destinationPath);
    }
};

export const toDts = async (destinationDirectory: string) => {
    const tsconfig = getTsconfig();
    const sourceDirectory = path.join(tsconfig?.config.compilerOptions?.sourceRoot || "./src");
    const sourceDirectoryStat = await fs.stat(sourceDirectory);

    if(!sourceDirectoryStat.isDirectory()) {
        throw new Error("Source path is not a directory");
    }
    baseSourcePath = sourceDirectory;

    const destinationDirectoryStat = await fs.stat(destinationDirectory);

    if(!destinationDirectoryStat.isDirectory()) {
        throw new Error("Destination path is not a directory");
    }
    destinationDirectory = path.join(destinationDirectory);

    await fs.mkdir(destinationDirectory, { recursive: true });
    await processElement(sourceDirectory, destinationDirectory);
};
