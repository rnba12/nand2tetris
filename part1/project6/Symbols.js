import Parser from "./Parser.js";

const table = {
    'R0': 0,
    'R1': 1,
    'R2': 2,
    'R3': 3,
    'R5': 5,
    'R6': 6,
    'R7': 7,
    'R8': 8,
    'R9': 9,
    'R10': 10,
    'R11': 11,
    'R12': 12,
    'R13': 13,
    'R14': 14,
    'R15': 15,
    'SCREEN': 16384,
    'KBD': 24576,
    'SP': 0,
    'LCL': 1,
    'ARG': 2,
    'THIS': 3,
    'THAT': 4
};

let n = 16;

const Symbol = {

    set(symbol, index) {
        if (Parser.isLabel(symbol)) {
            symbol = symbol.replace('(', '');
            symbol = symbol.replace(')', '');
            if (!table[symbol]) {
                table[symbol] = index;
            }
        } else if (Parser.isSymbol(symbol)) {
            table[symbol] = n;
            n++;
        }
    },

    get(symbol) {
        return table[symbol]
    },

    symbolExists(token) {
        return !!table[token]
    }
}

export default Symbol;
