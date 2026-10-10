/**
 * @typedef {Object} ParsedLine
 * @property {string} command
 * @property {string[]} args
 */

const Parser = {

    /** 
     * @param {string} file
     * @returns {ParsedLine[]} parsedLine
     */
    loadFile(file) {
        const rawLines = file.split('\r\n');
        const parsedLines = [];
        rawLines.forEach(line => {
            line = line.split('//')[0];
            if (line.length) {
                const tokens = line.split(' ');
                const command = tokens.shift();
                parsedLines.push({command, args: tokens});
            }
        });
        return parsedLines;
    }
}

export default Parser;
