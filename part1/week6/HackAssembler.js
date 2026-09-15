import { argv } from 'node:process';
import fs from 'node:fs/promises'
import Parser from './Parser.js';
import Code from './Code.js';
import Symbol from './Symbols.js';

async function main(filename) {
    const file = await fs.readFile(filename, {encoding: 'utf-8'});
    
    let parsedLines = Parser.loadFile(file);

    // first pass
    const linesWithLabels = []
    parsedLines.forEach((line, i) => {
        if (Parser.isLabel(line)) {
            // take into account the removed lines above when setting index of label
            Symbol.set(line, i - linesWithLabels.length)
            linesWithLabels.push(line);
        }
    });
    linesWithLabels.forEach(labelLine => {
        parsedLines = parsedLines.filter(parsedLine => parsedLine !== labelLine);
    });

    let machineCode = '';

    parsedLines.forEach((line, i) => {
        const code = Code.convertInstruction(parsedLines[i]);
        machineCode += code;
        if (i !== parsedLines.length -1) {
            machineCode += '\n';
        }      
    })

    const newFilename = filename.split('.')[0] + '.hack';
    await fs.writeFile(newFilename, machineCode);
}

main(argv[2]);
