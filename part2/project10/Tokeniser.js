function formatCode(code) {
    code = code.replaceAll(/\/\*\*(.|\s)*?(\*\/)/g, '');
    code = code.replaceAll(/\/\/.*/g, '');
    const lines = []
    code.split('\n').forEach(line => {
        line = line.trim();
        if (line) {
        lines.push(line);
        }
    })
    return lines.join(' ');
}

function getTokenType(token) {
    if (keywords.includes(token)) {
        return TOKEN_TYPE.KEYWORD;
    } else if (symbols.includes(token)) {
        return TOKEN_TYPE.SYMBOL;
    } else if (Number.isInteger(Number(token))) {
        return TOKEN_TYPE.INT_CONST
    } else {
        if (Number.isInteger(Number(token[0]))) {
            throw Error(`Synatx Error: Invalid Token (${token})`);
        }
        return TOKEN_TYPE.IDENTIFIER;
    }
}

export const TOKEN_TYPE = {
    KEYWORD: 0,
    SYMBOL: 1,
    INT_CONST: 2,
    STRING_CONST: 3,
    IDENTIFIER: 4
};
    const keywords = ['class', 'constructor', 'function',
'method', 'field', 'static', 'var', 'int',
'char', 'boolean', 'void', 'true', 'false',
'null', 'this', 'let', 'do', 'if', 'else',
'while', 'return'];

const symbols = ['{', '}', '(', ')', '[', ']', '.', ',', ';', '+', '-', '*', '/', '&', '|', '<', '>', '=', '~']

const Tokeniser = {

    /** @param {string} code */
    execute(code) {
        const content = formatCode(code);
        let buffer = '';
        let readingString = false;

        let tokens = [];

        const clearBuffer = (type) => {
            if (buffer) {
                tokens.push({
                    value: buffer,
                    type: type ?? getTokenType(buffer)
                })
            }
            buffer = '';
        }

        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            if (char === ' ' && !readingString) { 
                clearBuffer();
                continue;
            } else if (symbols.includes(char)) {
                clearBuffer();
                tokens.push({value: char, type: TOKEN_TYPE.SYMBOL});
                continue;
            } else if (char === '"') {
                if (readingString) {
                    clearBuffer(TOKEN_TYPE.STRING_CONST);
                }
                readingString = !readingString;
                continue;
            }
            buffer += char;
        }
        return tokens;
    }
};

export default Tokeniser;
