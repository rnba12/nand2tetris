import CodeWriter from "../Writer.js";

const Push = {

    execute(args) {
        const [segment, value] = args;
        const comment = `// push ${segment} ${value}\n`;
        let assembly = '';
        if (segment === 'constant') {
            assembly = this.pushConstant(value);
        } else if (segment === 'pointer') {
            assembly = this.pushPointer(value);
        }
        else {
            const segmentLabel = CodeWriter.getSegment(segment, value);
            assembly = CodeWriter.setSegmentAddress(segmentLabel, value) + this.pushFromOffsetAddr();
        }
        return comment + assembly;
    },

    pushConstant(value) {
        return `@${value}
D=A
@SP
A=M
M=D
` + CodeWriter.incrementStackPointer();
    },

    pushPointer(value) {
        return `@${value === '0' ? 'THIS' : 'THAT'}
D=M
@SP
A=M
M=D
` + CodeWriter.incrementStackPointer();
    },

    pushFromOffsetAddr() {
    return `@addr
A=M
D=M
@SP
A=M
M=D 
` + CodeWriter.incrementStackPointer();
}
};

export default Push;
