// push argument 1
@1
D=A
@ARG
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
// pop pointer 1
@SP
A=M-1
D=M
@THAT
M=D
@SP
M=M-1
// push constant 0
@0
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop that 0
@0
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
// push constant 1
@1
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop that 1
@1
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
// push argument 0
@0
D=A
@ARG
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
// push constant 2
@2
D=A
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
// pop argument 0
@0
D=A
@ARG
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
// label
(LOOP)
// push argument 0
@0
D=A
@ARG
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
// if goto
@SP
A=M-1
D=M
@SP
M=M-1
@COMPUTE_ELEMENT
D;JNE
// goto
@END
0;JMP
// label
(COMPUTE_ELEMENT)
// push that 0
@0
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
// push that 1
@1
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
// pop that 2
@2
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
// push pointer 1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
// push constant 1
@1
D=A
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
// pop pointer 1
@SP
A=M-1
D=M
@THAT
M=D
@SP
M=M-1
// push argument 0
@0
D=A
@ARG
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
// push constant 1
@1
D=A
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
// pop argument 0
@0
D=A
@ARG
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
// goto
@LOOP
0;JMP
// label
(END)
