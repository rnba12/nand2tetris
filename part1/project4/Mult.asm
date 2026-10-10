// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/4/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
// The algorithm is based on repetitive addition.

// init sum
@sum
M=0

// set index i=R0
@R0
D=M
@i
M=D

// loop start
(LOOP)
// if i=0 goto OUTPUT
@i
D=M
@OUTPUT
D;JEQ
// add sum=sum+R1
@R1
D=M
@sum
M=D+M
// decrement index
@i
M=M-1
// goto LOOP
@LOOP 
0;JMP
// loop end

// set R2=sum
(OUTPUT)
  @sum
  D=M
  @R2
  M=D
(END) // end program
  @END
  0;JMP