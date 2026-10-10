import CodeWriter from "../Writer.js";

const Arithmetic = {

    execute(command) {
        switch (command) {
            case 'add':
                return add();
            case 'sub':
                return sub();
            case 'neg':
                return neg();
            default:
                break;
        }
    }

}

function add() {
    return `// add
@SP
A=M-1
D=M
A=A-1
M=D+M
` + CodeWriter.decrementStackPointer();
}

function sub() {
    return `// subtract
@SP
A=M-1
D=M
A=A-1
M=M-D
` + CodeWriter.decrementStackPointer();
}

function neg() {
    return `// negate
@SP
A=M-1
M=-M
`
}

export default Arithmetic;
