const Parser = {

    /** @param {string} file */
    loadFile(file) {
        const rawLines = file.split('\r\n');
        const parsedLines = [];
        rawLines.forEach(line => {
            line = line.split('//')[0];
            if (line.length) {
                parsedLines.push(line);
            }
        });
        return parsedLines;
    }

}

export default Parser;
