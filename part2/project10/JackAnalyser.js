import path from 'node:path';
import fs from 'fs/promises';
import { argv } from 'node:process';
import CompilationEngine from './CompilationEngine.js';

const JackAnalyser = {

    async execute(input) {
        const fileInfo = await this.loadFiles(input);
        fileInfo.forEach(async ({content, fileName, newFilePath}) => {
            const parseTree = CompilationEngine.execute(content);
            await fs.writeFile(newFilePath, parseTree);
        });
    },

    /**
     * @param {String} input Either a single .jack file or a directory containing one or more .jack files
     */
    async loadFiles(input) {
        let dirName;
        const filePaths = []

        const extension = path.extname(input);
        if (extension === '.jack') {
            filePaths.push(input);
        } else if (!extension) { // assume path to directory
            dirName = input;
            const files = await fs.readdir(input);
            files.forEach(file => {
                if (path.extname(file) === '.jack') {
                    filePaths.push(`${dirName}/${file}`);
                }
            })
        }

        let newDir;
        if (dirName) {
            newDir = 'parsed_' + dirName;
            try {
                await fs.mkdir(newDir);
            } catch (error) {
                if (error.code !== 'EEXIST') {
                    throw error;
                }
            }
        }

        const fileInfo = [];
        for (const filePath of filePaths) {
            const fileName = path.parse(filePath).name;
            const content = await fs.readFile(filePath, { encoding: 'utf-8' });
            let newFilePath = fileName + '.xml';
            if (newDir) {
                newFilePath = `${newDir}/${newFilePath}`;
            }
            fileInfo.push({
                fileName,
                content,
                newFilePath
            })
        }
        return fileInfo;
    }
}

JackAnalyser.execute(argv[2]);
