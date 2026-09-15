import { argv } from 'node:process';
import fs from 'node:fs/promises'
import Parser from './Parser.js';
import Code from './Code.js';

async function main(filename) {
    const file = await fs.readFile(filename, {encoding: 'utf-8'});
    
    const parsedLines = Parser.loadFile(file);

    let machineCode = '';

    for (let i = 0; i < parsedLines.length; i++) {
        const code = Code.convertInstruction(parsedLines[i]);
        machineCode += code;
        if (i !== parsedLines.length -1) {
            machineCode += '\n';
        }      
    }

    const newFilename = filename.split('.')[0] + '.hack';
    await fs.writeFile(newFilename, machineCode);
}

main(argv[2]);
