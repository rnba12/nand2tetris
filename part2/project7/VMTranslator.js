import { argv } from "node:process";
import fs from 'fs/promises';
import Parser from "./Parser.js";
import Code from "./Code.js";
import path from "node:path";

async function main(vmFile) {
    const file = await fs.readFile(vmFile, {encoding: 'utf-8'});    
    /**@type {string[]} */
    let parsedLines = Parser.loadFile(file);

    const fileName = path.parse(vmFile).name;

    Code.staticPrefix = fileName;

    let assembly = '';

    parsedLines.forEach(line => {
        const tokens = line.split(' ');
        const command = tokens.shift();
        assembly += Code.handleCommand(command, tokens);
    });

    const newFilename = vmFile.split('.')[0] + '.asm';
    await fs.writeFile(newFilename, assembly);
}

main(argv[2])
