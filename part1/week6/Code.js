import Parser from "./Parser.js";

const Code = {

    /** @param {string} token */
    convertInstruction(token) {
        let machineCode;
        if (Parser.isAInstruction(token)) {
            machineCode = this.convertAInstruction(Parser.getAInstruction(token))
        } else if (Parser.isCInstruction(token)) {
            machineCode = this.convertCInstruction(token)
        }
        return machineCode;
    },

    convertAInstruction(token) {
        const number = Number(token).toString(2);
        return '0'.repeat(16 - number.length) + number;
    },

    convertCInstruction(token) {
        let command = '111';
        const {cmp, dst, jmp} = Parser.getCInstruction(token);
        // computation
        const comp = compMap[cmp] ?? '0000000';
        // destination
        let dest = '';
        dest += dst?.includes('A') ? '1' : '0'; 
        dest += dst?.includes('D') ? '1' : '0'; 
        dest += dst?.includes('M') ? '1' : '0'; 
        // jump
        const jump = jumpMap[jmp] ?? '000';
        return command + comp + dest + jump;
    }

}

const compMap = {
    '0':    '0101010',
    '1':    '0111111',
    '-1':   '0111010',
    'D':    '0001100',
    'A':    '0110000',
    '!D':   '0001101',
    '!A':   '0110001',
    '-D':   '0001111',
    '-A':   '0110011',
    'D+1':  '0011111',
    'A+1':  '0110111',
    'D-1':  '0001110',
    'A-1':  '0110010',
    'D+A':  '0000010',
    'D-A':  '0010011',
    'A-D':  '0000111',
    'D&A':  '0000000',
    'D|A':  '0010101',
    'M':    '1110000',
    '!M':   '1110001',
    '-M':   '1110011',
    'M+1':  '1110111',
    'M-1':  '1110010',
    'D+M':  '1000010',
    'D-M':  '1010011',
    'M-D':  '1000111',
    'D&M':  '1000000',
    'D|M':  '1010101'
}

const jumpMap = {
    'JGT': '001',
    'JEQ': '010',
    'JGE': '011',
    'JLT': '100',
    'JNE': '101',
    'JLE': '110',
    'JMP': '111'
}

export default Code;
