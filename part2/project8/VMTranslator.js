import {argv} from 'node:process';
import path from 'node:path';
import fs from 'fs/promises';
import Parser from './Parser.js';
import CodeWriter from './Code/Writer.js';

/**
 * @param {String} input Either a single .vm file or a directory containing one or more .vm files
 */
async function main(input) {
    let dirName;
    const filePaths = []
    
    const extension = path.extname(input); 
    if (extension === '.vm') {
        filePaths.push(input);
    } else if (!extension) { // assume path to directory
        dirName = input;
        const files = await fs.readdir(input);
        files.forEach(file => {
            if (path.extname(file) === '.vm') {
                filePaths.push(`${dirName}/${file}`);
            }
        })
    }
    
    for (const filePath of filePaths) {
        const fileName = path.parse(filePath).name
        const file = await fs.readFile(filePath, {encoding: 'utf-8'});
        const parsedLines = Parser.loadFile(file);
        const assembly = CodeWriter.execute(parsedLines, fileName);

        let newFilePath = fileName + '.asm';
        if (dirName) {
            newFilePath = `${dirName}/${newFilePath}`;
        }
        await fs.writeFile(newFilePath, assembly);
    }
}

main(argv[2]);
