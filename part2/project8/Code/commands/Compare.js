import CodeWriter from "../Writer.js";

const commentMap = {
    'EQ': 'equal to',
    'LT': 'less than',
    'GT': 'greater than'
};

const Compare = {

    execute(command) {
        command = command.toUpperCase();
        CodeWriter.labelIndex += 1;
        return `// ${commentMap[command]}
@SP
A=M-1
D=M
A=A-1
D=M-D
@SP
A=M-1
A=A-1
M=-1
@TRUE.${CodeWriter.labelIndex}
D;J${command}
@SP
A=M-1
A=A-1
M=0
(TRUE.${CodeWriter.labelIndex})
` + CodeWriter.decrementStackPointer();
    }

};

export default Compare;
