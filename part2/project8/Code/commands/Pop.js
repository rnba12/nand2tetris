import CodeWriter from "../Writer.js";

const Pop = {

    execute(args) {
        const [segment, value] = args;
        const comment = `// pop ${segment} ${value}\n`;
        let assembly = '';
        if (segment === 'pointer') {
            assembly = popPointer(value);
        } else {
            const segmentLabel = CodeWriter.getSegment(segment, value);
            assembly = CodeWriter.setSegmentAddress(segmentLabel, value) + popFromOffsetAddr();
        }
        return comment + assembly;
    },

};

function popPointer(value) {
    return `@SP
A=M-1
D=M
@${value === '0' ? 'THIS' : 'THAT'}
M=D
` + CodeWriter.decrementStackPointer();
}

function popFromOffsetAddr() {
    return `@SP
A=M-1
D=M
@addr
A=M
M=D
` + CodeWriter.decrementStackPointer();
};

export default Pop;
