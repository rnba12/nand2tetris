import Tokeniser, { TOKEN_TYPE } from "./Tokeniser.js";

/**
 * @typedef {Object} Token
 * @property {string} value
 * @property {number} type
 */


let xmlDepth = 0; 

function openTag(tag) {
    const output = `${' '.repeat(xmlDepth * 2)}<${tag}>\n`;
    xmlDepth++;
    return output;
}

function closeTag(tag) {
    xmlDepth--;
    const output = `${' '.repeat(xmlDepth * 2)}</${tag}>\n`;
    return output;
}

function xml(tag, content) {

    return `${' '.repeat(xmlDepth * 2)}<${tag}>${content}</${tag}>\n`;
}

function keyword(value) {
    return xml('keyword', value);
}

function symbol(value) {
    return xml('symbol', value);
}

function identifier(value) {
    return xml('identifier', value);
}

const TYPE_NAME_MAP = {
    [TOKEN_TYPE.KEYWORD]: 'keyword',
    [TOKEN_TYPE.SYMBOL]: 'symbol',
    [TOKEN_TYPE.INT_CONST]: 'integer',
    [TOKEN_TYPE.STRING_CONST]: 'string',
    [TOKEN_TYPE.IDENTIFIER]: 'identifier'
};

/** @type {ArrayIterator<Token>} */
let tokens;
let index = -1;

const getCurrentToken = () => tokens[index];
const advance = () => index++;

const currentTokenEquals = (...expected) => {
    return expected.includes(getCurrentToken().value);
};

const CompilationEngine = {

    execute(code) {
        xmlDepth = 0;
        tokens = Tokeniser.execute(code);
        index = 0; // set first token;
        let output = '';
        output = this.class();
        return output;
    },

    process(expected) {
        expected = typeof expected === 'string' ? {tokens: [expected]} : expected;
        const {tokens, type} = expected;
        const currentToken = getCurrentToken();
        if (tokens && !currentTokenEquals(...tokens)) {
            throw Error(`Synatx Error: expected "${tokens}" instead of "${currentToken.value}"`);
        }
        if (type && type !== currentToken.type) {
            throw Error(`Synatx Error: expected "${currentToken.value}" to be of type "${TYPE_NAME_MAP[type]}" instead of ${TYPE_NAME_MAP[currentToken.type]}`);
        }
        let output = '';
        const value = ` ${currentToken.value} `
        switch (currentToken.type) {
            case TOKEN_TYPE.KEYWORD:
                output += keyword(value);
                break;
            case TOKEN_TYPE.STRING_CONST:
                output += xml('stringConstant', value);
                break;
            case TOKEN_TYPE.INT_CONST:
                output += xml('integerConstant', value);
                break;
            case TOKEN_TYPE.IDENTIFIER:
                output += identifier(value);
                break;
            case TOKEN_TYPE.SYMBOL:
                output += symbol(value);
                break;
        }
        advance();
        return output;
    },

    class() {
        let content = openTag('class');
        content += this.process('class');
        content += this.process({type: TOKEN_TYPE.IDENTIFIER}); // className (identifier)
        content += this.process('{');

        while (!currentTokenEquals('}')) {
            if (currentTokenEquals('static', 'field')) {
                content += this.classVarDec();
            } else if (currentTokenEquals('constructor', 'function', 'method')) {
                content += this.subroutineDec();
            }
        }
        content += this.process('}');
        content += closeTag('class');
        return content;
    },

    classVarDec() {
        let content = openTag('classVarDec');
        content += this.process({tokens: ['static', 'field']}); //
        content += this.type(); // type 
        content += this.process({type: TOKEN_TYPE.IDENTIFIER}); // varName 
        while (!currentTokenEquals(';')) {
            content += this.process(',');
            content += this.process({type: TOKEN_TYPE.IDENTIFIER}); // varName
        }
        content += this.process(';');
        content += closeTag('classVarDec');
        return content;
    },

    subroutineDec() {
        let content = openTag('subroutineDec');
        if (currentTokenEquals('constructor')) {
            content += this.process('constructor');
            content += this.type();
        } else {
            content += this.process({tokens: ['function','method']});
            if (currentTokenEquals('void')) {
                content += this.process('void');
            } else {
                this.type();
            }
        }
        content += this.process({type: TOKEN_TYPE.IDENTIFIER}); // subroutineName
        content += this.process('('); // (
        content += this.parameterList();
        content += this.process(')'); // )
        content += this.subroutineBody();
        content += closeTag('subroutineDec');
        return content;
    },

    parameterList() {
        let content = openTag('parameterList');
        while(!currentTokenEquals(')')) {
            if (currentTokenEquals(',')) {
                content += this.process(',');
            }
            content += this.type();
            content += this.process({type: TOKEN_TYPE.IDENTIFIER});
        }
        content += closeTag('parameterList');
        return content;
    },

    subroutineBody() {
        let content = openTag('subroutineBody');
        content += this.process('{');
        while (!currentTokenEquals('}')) {
            if (currentTokenEquals('var')) {
                content += this.varDec();
            } else {
                content += this.statements();
            }
        }
        content += this.process('}');
        content += closeTag('subroutineBody');
        return content;
    },

    // Could make this generic, use for classVarDec & parameterList
    varDec() {
        let content = openTag('varDec');
        content += this.process('var'); // 'var'
        content += this.type();
        content += this.process({type: TOKEN_TYPE.IDENTIFIER}); // varName (identifier)
        while (!currentTokenEquals(';')) {
            content += this.process(',');
            content += this.process({type: TOKEN_TYPE.IDENTIFIER});
        }
        content += this.process(';'); // ';'
        content += closeTag('varDec');
        return content;
    },

    statements() {
        let content = openTag('statements');
        while(currentTokenEquals('let', 'if', 'while', 'do', 'return')) {
            switch (getCurrentToken().value) {
                case 'let':
                    content += this.let();
                    break;
                case 'if':
                    content += this.if();
                    break;
                case 'while':
                    content += this.while();
                    break;
                case 'do':
                    content += this.do();
                    break;
                case 'return':
                    content += this.return();
                    break;
            }
        }
        content += closeTag('statements');
        return content;
    },

    let() {
        let content = openTag('letStatement');
        content += this.process('let'); // let
        content += this.process({type: TOKEN_TYPE.IDENTIFIER}); // varName
        if (currentTokenEquals('[')) {
            content += this.process('[');
            content += this.expression();
            content += this.process(']');
        }
        content += this.process('=');
        content += this.expression();
        content += this.process(';');
        content += closeTag('letStatement');
        return content;
    },

    if() {
        let content = openTag('ifStatement');
        content += this.process('if');
        content += this.process('(');
        content += this.expression();
        content += this.process(')');
        content += this.process('{');
        content += this.statements();
        content += this.process('}');
        if (currentTokenEquals('else')) {
            content += this.process('else');
            content += this.process('{');
            content += this.statements();
            content += this.process('}');
        }
        content += closeTag('ifStatement');
        return content;
    },

    while() {
        let content = openTag('whileStatement');
        content += this.process('while'); // should be a 'while'
        content += this.process('(');
        content += this.expression();
        content += this.process(')');
        content += this.process('{');
        content += this.statements();
        content += this.process('}');
        content += closeTag('whileStatement')
        return content;
    },

    do() {
        let content = openTag('doStatement');
        content += this.process('do');
        content += this.subroutineCall(); // subroutineCall
        content += this.process(';');
        content += closeTag('doStatement');
        return content;
    },

    return() {
        let content = openTag('returnStatement');
        content += this.process('return');
        if (!currentTokenEquals(';')) {
            content += this.expression();
        }
        content += this.process(';');
        content += closeTag('returnStatement');
        return content;
    },

    expression() {
        let content = openTag('expression');
        content += this.term();
        if (currentTokenEquals('+', '-', '*', '/', '&', '|', '<', '>', '=')) {
            content += this.process({type: TOKEN_TYPE.SYMBOL}); // op
            content += this.term();
        }
        content += closeTag('expression');
        return content;
    },

    term() {
        let content = openTag('term');
        if (currentTokenEquals('true', 'false', 'null', 'this')) {
            content += this.process({type: TOKEN_TYPE.KEYWORD});
        } else if (getCurrentToken().type === TOKEN_TYPE.INT_CONST) {
            content += this.process({type: TOKEN_TYPE.INT_CONST});
        } else if (getCurrentToken().type === TOKEN_TYPE.STRING_CONST) {
            content += this.process({type: TOKEN_TYPE.STRING_CONST});
        } else if (currentTokenEquals('(')) {
            content += this.process('(');
            content += this.expression();
            content += this.process(')');
        } else if (currentTokenEquals('-', '~')) {
            content += this.process({tokens: ['-', '~']});
            content += this.term();
        } else {
            content += this.process({type: TOKEN_TYPE.IDENTIFIER});
            if (currentTokenEquals('[')) {
                content += this.process('[');
                content += this.expression();
                content += this.process(']');
            } else if (currentTokenEquals('.')) {
                content += this.process('.');
                content += this.process({type: TOKEN_TYPE.IDENTIFIER});
                content += this.process('(');
                content += this.expressionlist();
                content += this.process(')');
            } else if (currentTokenEquals('(')) {
                content += this.process('(');
                content += this.expressionlist();
                content += this.process(')');
            }
        }
        content += closeTag('term');
        return content;
    },

    subroutineCall() {
        let content = this.process({type: TOKEN_TYPE.IDENTIFIER});
        if (currentTokenEquals('.')) {
            content += this.process('.');
            content += this.process({type: TOKEN_TYPE.IDENTIFIER});
        } 
        content += this.process('(');
        content += this.expressionlist();
        content += this.process(')');
        return content;
    },

    expressionlist() {
        let content = openTag('expressionList');
        if (currentTokenEquals(')')) {
            content += closeTag('expressionList');
            return content;
        }
        content += this.expression();
        while(currentTokenEquals(',')) {
            content += this.process(',');
            content += this.expression();
        }
        content += closeTag('expressionList');
        return content;
    },

    type() {
        if (currentTokenEquals('int', 'char', 'boolean')) {
            return this.process({tokens: ['int', 'char', 'boolean']});
        } else {
            return this.process({type: TOKEN_TYPE.IDENTIFIER}); // className
        }
    }
}

export default CompilationEngine;
