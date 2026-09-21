// push constant 3030
@3030
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop pointer 0
@SP
A=M-1
D=M
@THIS
M=D
@SP
M=M-1
// push constant 3040
@3040
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop pointer 1
@SP
A=M-1
D=M
@THAT
M=D
@SP
M=M-1
// push constant 32
@32
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop this 2
@2
D=A
@THIS
A=M
D=D+A
@addr
M=D
@SP
A=M-1
D=M
@addr
A=M
M=D
@SP
M=M-1
// push constant 46
@46
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop that 6
@6
D=A
@THAT
A=M
D=D+A
@addr
M=D
@SP
A=M-1
D=M
@addr
A=M
M=D
@SP
M=M-1
// push pointer 0
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
// push pointer 1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
// add
@SP
A=M-1
D=M
A=A-1
M=D+M
@SP
M=M-1
// push this 2
@2
D=A
@THIS
A=M
D=D+A
@addr
M=D
@addr
A=M
D=M
@SP
A=M
M=D 
@SP
M=M+1
// subtract
@SP
A=M-1
D=M
A=A-1
M=M-D
@SP
M=M-1
// push that 6
@6
D=A
@THAT
A=M
D=D+A
@addr
M=D
@addr
A=M
D=M
@SP
A=M
M=D 
@SP
M=M+1
// add
@SP
A=M-1
D=M
A=A-1
M=D+M
@SP
M=M-1
