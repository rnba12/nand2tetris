import Arithmetic from "./commands/Arithmetic.js";
import Compare from "./commands/Compare.js";
import Logic from "./commands/Logic.js";
import Pop from "./commands/Pop.js";
import Push from "./commands/Push.js";

const CodeWriter = {

    labelIndex: 0,
    staticPrefix: '',

    /**
     * 
     * @param {import("../Parser").ParsedLine[]} parsedLines 
     */
    execute(parsedLines, staticPrefix) {
        this.labelIndex = 0;
        this.staticPrefix = staticPrefix;

        let assembly = '';
        parsedLines.forEach(line => {
            assembly += this.handleCommand(line);
        });
        return assembly;
    },

    /**
     * 
     * @param {import("../Parser").ParsedLine} parsedLine 
     */
    handleCommand(parsedLine) {
        const { command, args } = parsedLine;
        switch (command) {
            case 'push':
                return Push.execute(args);
            case 'pop':
                return Pop.execute(args);
            case 'add':
            case 'sub':
            case 'neg':
                return Arithmetic.execute(command);
            case 'eq':
            case 'lt':
            case 'gt':
                return Compare.execute(command);
            case 'and':
            case 'not':
            case 'or':
                return Logic.execute(command);
            default:
                break;
        }
    },

    incrementStackPointer() {
        return `@SP
M=M+1
`
    },

    decrementStackPointer() {
        return `@SP
M=M-1
`
    },

    getSegment(arg, index) {
        switch (arg) {
            case 'local':
                return 'LCL';
            case 'argument':
                return 'ARG';
            case 'this':
                return 'THIS';
            case 'that':
                return 'THAT';
            case 'temp':
                return 'TEMP'
            case 'static':
                return `${this.staticPrefix}.${index}`;
            default:
                break;
        }
    },

    setSegmentAddress(segment, offset) {
        if (segment === 'TEMP') {
            return this.setTempAddress(offset);
        }
        return `@${offset}
D=A
@${segment}
A=M
D=D+A
@addr
M=D
`
    },

    setTempAddress(index) {
        return `@5
D=A
@${index}
D=D+A
@addr
M=D
`
    }

}

export default CodeWriter;
