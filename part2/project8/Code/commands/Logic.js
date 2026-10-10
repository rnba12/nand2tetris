import CodeWriter from "../Writer.js";

const Logic = {

    execute(command) {
        switch (command) {
            case 'and':
                return and();
            case 'or':
                return or();
            case 'not':
                return not();
            default:
                break;
        }
    }

};

function and() {
    return `// and
@SP
A=M-1
D=M
A=A-1
M=D&M
` + CodeWriter.decrementStackPointer();
}

function or() {
    return `// or
@SP
A=M-1
D=M
A=A-1
M=D|M
` + CodeWriter.decrementStackPointer();
}

function not() {
    return `// not
@SP
A=M-1
M=M+1
M=-M
`
}

export default Logic;
