const segmentPointers = {
    'local': 'LCL',
    'argument': 'ARG',
    'this': 'THIS',
    'that': 'THAT',
    'temp': 'TEMP'
};

const Code = {

    labelIndex: 0,

    staticPrefix: '',

    handleCommand(command, args) {
        switch (command) {
            case 'push':
                return this.handlePush(args[0], args[1]);
            case 'pop':
                return this.handlePop(args[0], args[1]);
            case 'add':
                return this.handleAdd();
            case 'sub':
                return this.handleSubtract();
            case 'neg':
                return this.handleNegate();
            case 'eq':
                return this.handleCompare('EQ');
            case 'lt':
                return this.handleCompare('LT');
            case 'gt':
                return this.handleCompare('GT');
            case 'and':
                return this.handleAnd();
            case 'or':
                return this.handleOr();
            case 'not':
                return this.handleNot();
            default:
                break;
        }
    },

    getSegment(arg, index) {
        if (arg === 'static') {
            return `${this.staticPrefix}.${index}`
        }
        return segmentPointers[arg]
    },

    handlePush(segment, value) {
        const comment = `// push ${segment} ${value}\n`;
        let assembly = '';
        if (segment === 'constant') {
            assembly = pushConstant(value);
        } else if (segment === 'pointer') {
            assembly = pushPointer(value);
        }
        else {
            const segmentLabel = this.getSegment(segment, value);
            assembly = setSegmentAddress(segmentLabel, value) + pushFromOffsetAddr();
        }
        return comment + assembly;
    },

    handlePop(segment, value) {
        const comment = `// pop ${segment} ${value}\n`;
        let assembly = '';
        if (segment === 'pointer') {
            assembly = popPointer(value);
        } else {
            const segmentLabel = this.getSegment(segment, value);
            assembly = setSegmentAddress(segmentLabel, value) + popFromOffsetAddr();
        }
        return comment + assembly;
    },

    handleAdd() {
        return `// add
@SP
A=M-1
D=M
A=A-1
M=D+M
` + decrementStackPointer();
    },

    handleSubtract() {
        return `// subtract
@SP
A=M-1
D=M
A=A-1
M=M-D
` + decrementStackPointer();
    },

    handleNegate() {
        return `// negate
@SP
A=M-1
M=-M
`
    },

    handleAnd() {
        return `// and
@SP
A=M-1
D=M
A=A-1
M=D&M
` + decrementStackPointer();
    },

    handleOr() {
        return `// or
@SP
A=M-1
D=M
A=A-1
M=D|M
` + decrementStackPointer();
    },

    handleNot() {
        return `// not
@SP
A=M-1
M=M+1
M=-M
`
    },

    handleCompare(sign) {
        const result = sign === ''
        this.labelIndex += 1;
        return `// ${sign}
@SP
A=M-1
D=M
A=A-1
D=M-D
@SP
A=M-1
A=A-1
M=-1
@TRUE.${this.labelIndex}
D;J${sign}
@SP
A=M-1
A=A-1
M=0
(TRUE.${this.labelIndex})
` + decrementStackPointer();
    }
}

const pushConstant = (value) => {
    return `@${value}
D=A
@SP
A=M
M=D
` + incrementStackPointer();
}

const incrementStackPointer = () => {
    return `@SP
M=M+1
`
}

const decrementStackPointer = () => {
    return `@SP
M=M-1
`
}

const setSegmentAddress = (segment, offset) => {
    if (segment === 'TEMP') {
        return setTempAddress(offset);
    }
    return `@${offset}
D=A
@${segment}
A=M
D=D+A
@addr
M=D
`
}

const setTempAddress = (index) => {
    return `@5
D=A
@${index}
D=D+A
@addr
M=D
`
}

const pushFromOffsetAddr = () => {
    return `@addr
A=M
D=M
@SP
A=M
M=D 
` + incrementStackPointer();
};

const popFromOffsetAddr = () => {
    return `@SP
A=M-1
D=M
@addr
A=M
M=D
` + decrementStackPointer();
};

const pushPointer = (value) => {
    return `@${value === '0' ? 'THIS' : 'THAT'}
D=M
@SP
A=M
M=D
` + incrementStackPointer();
}

const popPointer = (value) => {
    return `@SP
A=M-1
D=M
@${value === '0' ? 'THIS' : 'THAT'}
M=D
` + decrementStackPointer();
}

export default Code;
