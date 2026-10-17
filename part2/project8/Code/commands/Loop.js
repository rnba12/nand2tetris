import CodeWriter from "../Writer.js";

const Loop = {

    execute(command, arg) {
        switch (command) {
            case 'label':
                return `// label\n(${arg})\n`;
            case 'goto':
                return `// goto\n@${arg}\n0;JMP\n`;
            case 'if-goto':
                return ifGoto(arg);
        }
    }

};

function ifGoto(label) {
    return `// if goto
@SP
A=M-1
D=M
` + 
CodeWriter.decrementStackPointer() +
`@${label}
D;JNE
`
}

export default Loop;
