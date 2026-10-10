const Parser = {

    /** @param {string} file */
    loadFile(file) {
        const rawLines = file.split('\n');
        const parsedLines = [];
        rawLines.forEach(line => {
            let rawTokens = line.split(' ');
            const commentStart = rawTokens.findIndex(token => token.includes('//'));
            if (commentStart >= 0) {
                rawTokens.splice(commentStart, Infinity);
            }
            const tokens = rawTokens.filter(token => token && token.length);
            if (tokens.length) {
                parsedLines.push(tokens[0]);
            }
        });
        return parsedLines;
    },

    /** @param {string} token */
    isAInstruction(token) {
        return token.startsWith('@');
    },

    /** @param {string} token */
    isSymbol(token) {
        return this.isAInstruction(token) && isNaN(token);
    },

    /** @param {string} token */
    isCInstruction(token) {
        return token.includes('=') || token.includes(';');
    },

    /** @param {string} token */
    isLabel(token) {
        return token.startsWith('(');
    },

    /** @param {string} token */
    getAInstruction(token) {
        return token.slice(1);
    },

    /** @param {string} token */
    getCInstruction(token) {
        let dst, cmp, jmp, cmpJmp;
        const [t1, t2] = token.split('=');
        if (token.includes('=')) {
            dst = t1;
            cmpJmp = t2;
        } else {
            cmpJmp = t1;
        }
        const [t3, t4] = cmpJmp.split(';');
        if (token.includes(';')) {
            cmp = t3;
            jmp = t4;
        } else {
            cmp = t3;
        }
        return {
            dst: dst ?? null,
            cmp: cmp ?? null,
            jmp: jmp ?? null
        }
    }

}

export default Parser;
