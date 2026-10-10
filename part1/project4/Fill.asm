// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/4/Fill.asm

// Runs an infinite loop that listens to the keyboard input. 
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel. When no key is pressed, 
// the screen should be cleared.

//// Replace this comment with your code.

(LOOP)
@KBD
D=M

@PRESSED
D;JNE
@NOT_PRESSED
D;JEQ

(PRESSED)
// paint screen
  @SCREEN
  D=A
  @addr
  M=D

  @8160
  D=A
  @n
  M=D
  (FILL)
    @addr
    A=M
    M=-1
    // move to next word
    @addr
    M=M+1

    @n
    M=M-1
    D=M
    @FILL
    D;JGT
  @LOOP
  0;JMP
(NOT_PRESSED)
  // unpaint screen
   @SCREEN
  D=A
  @addr
  M=D

  @8160
  D=A
  @n
  M=D
  (UNFILL)
    @addr
    A=M
    M=0
    // move to next word
    @addr
    M=M+1

    @n
    M=M-1
    D=M
    @UNFILL
    D;JGT
  @LOOP
  0;JMP