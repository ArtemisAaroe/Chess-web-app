import { Piece } from "./Piece";
import { PieceType } from "../emums/Piece";
import { ModeType } from "../emums/Board";

export class Board {
    private boardstate: (Piece|null)[][] = [];
    private mode: ModeType;
    private player: number;
    private moves: number;
    private bufferList: string[];
    private selectedPiece: string;

    constructor(boardstate: Map<string, { piece: Piece | null; color: string }>) {
        this.mode = ModeType.Start
        this.player = 1
        this.moves = 0
        this.bufferList = []
        this.selectedPiece = ""
        for (const number of ["1", "2", "3", "4", "5", "6", "7", "8"]) {
            const rowOfBoardstate: (Piece|null)[] = []
            for (const letter of ["A", "B", "C", "D", "E", "F", "G", "H"]) {
                rowOfBoardstate.push(this.guaranteePieceOrNull(boardstate.get(letter + number)?.piece))
            }
            this.boardstate.push(rowOfBoardstate);
        }
    }
    // starts the game
    public start(): string[][] {
        const output: string[][] = []
        this.mode = ModeType.PieceSelect;
        output.push([])
        output.push(this.getPieces(this.player))
        output.push([])
        this.bufferList = output[1]
        return output;

    }

    //takes input form the players and moves the game along
    public input(input: string): string[][] {
        const output: string[][] = []
        if (!this.bufferList.includes(input)) {
            this.selectedPiece = "";
            this.mode = ModeType.PieceSelect;
            output.push([]);
            console.log("this.getPieces")
            output.push(this.getPieces(this.player));

            
        } else if (this.mode === ModeType.PieceSelect) {
            this.mode = ModeType.MoveSelect;
            this.selectedPiece = input;
            output.push([]);
            console.log("this.getMoves")
            output.push(this.getMoves(input, this.player));

        } else if (this.mode === ModeType.MoveSelect) {
            this.mode = ModeType.PieceSelect;
            console.log("this.executeMove")
            output.push(this.executeMove(input));
            output.push(this.getPieces(this.player * (-1)));
            //output.push(this.bufferList);
            this.player = this.player * (-1)
            this.moves += 1;
            this.selectedPiece = "";
            this.mode = ModeType.PieceSelect;
        } else {
            throw new Error("the state of this object is broken")
        }
        output.push(this.bufferList)
        this.bufferList = output[1]
        return output

    }

    //finds all pieces for the currant player
    private getPieces(player: number): string[] {
        const pieces: string[] = [] 
        for (let row = 0; row < this.boardstate.length; row++){
            for (let column = 0; column < this.boardstate[0].length; column++) {
                if(this.boardstate[row][column]?.getPlayer() === player) {
                    pieces.push(this.numObjectToBoardCode({row: row, column: column}))
                }
            }
        }            
        return pieces
    }

    //finds avalable moves for selected piece
    //todo: add logic for pawn moves casteling, king kant walk into oposet player move.
    private getMoves(input: string, player: number): string[] {
        const moves: string[] = [];
        const illegalMoves: Set<string> = new Set<string>;
        const startingSquare: {row: number, column: number} = this.boardCodeToNumObject(input);
        const piece: Piece|null = this.boardstate[startingSquare.row][startingSquare.column];
        
        if (piece === null) {
            throw new Error(input + "is not a piece");
        }
        if (piece.getPlayer() !== player) {
            throw new Error(input + " is " + piece.getPlayerColor() + " and not piece of player");
        }
        if (piece.getType() === PieceType.King && piece.getPlayer() === this.player) {
            for (const opponentPiece of this.getPieces(player * (-1))){
                for (const square of this.getMoves(opponentPiece, player * (-1))) {
                    illegalMoves.add(square);
                }
            }
            
        }
        
        
        let possibleMoveSquare: {row: number, column: number};
        
        for (const direction of piece.getMovementMatrix()) {
            possibleMoveSquare = {row: startingSquare.row, column: startingSquare.column};
            possibleMoveSquare.row += direction[0];
            possibleMoveSquare.column += direction[1];
            
            if (!this.squareOnBoard(possibleMoveSquare)) {
                continue;
            }
            if (this.boardstate[possibleMoveSquare.row][possibleMoveSquare.column]?.getPlayer() === player ) {
                continue;
            }
            if (illegalMoves.has(this.numObjectToBoardCode(possibleMoveSquare))) {
                continue;
            }

            moves.push(this.numObjectToBoardCode(possibleMoveSquare))
            
            
            if (this.boardstate[possibleMoveSquare.row][possibleMoveSquare.column] !== null ) {
                continue;
            }

            while (!piece.getMovementIncremental()) {
                possibleMoveSquare.row += direction[0];
                possibleMoveSquare.column += direction[1];
                                
                if (!this.squareOnBoard(possibleMoveSquare)) {
                    break;
                }
                if (this.boardstate[possibleMoveSquare.row][possibleMoveSquare.column]?.getPlayer() === player ) {
                    break;
                }
                if (illegalMoves.has(this.numObjectToBoardCode(possibleMoveSquare))) {
                    break;
                }
                
                moves.push(this.numObjectToBoardCode(possibleMoveSquare))
                
                if (this.boardstate[possibleMoveSquare.row][possibleMoveSquare.column] !== null) {
                    break;
                }
            }

        }
        return moves;
    }

    //execute selected move
    //todo add special rulse for spesial cases
    private executeMove(input: string): string[] {
        const oldSquare: {row: number, column: number} = this.boardCodeToNumObject(this.selectedPiece)
        const piece: Piece|null = this.boardstate[oldSquare.row][oldSquare.column];
        const newSquare: {row: number, column: number} = this.boardCodeToNumObject(input);
        
        this.boardstate[oldSquare.row][oldSquare.column] = null;
        this.boardstate[newSquare.row][newSquare.column] = piece;
        
        // const oldBufferList: string[] = this.bufferList
        // this.player = this.player * (-1)
        // output.push([this.numObjectToBoardCode(oldSquare), this.numObjectToBoardCode(newSquare)])
        // output.push(this.getPieces()[1]);
        // output.push(oldBufferList)
        // this.moves += 1;
        // this.selectedPiece = "";
        return [this.numObjectToBoardCode(oldSquare), this.numObjectToBoardCode(newSquare)];
    }

    private guaranteePieceOrNull(piece: Piece|null|undefined): Piece|null {
        return piece == undefined ? null : piece
    }

    private squareOnBoard(square: {row: number, column: number}): boolean {
        return square.column >= 0 && 
            square.column < 8 &&
            square.row >= 0 && 
            square.row < 8;
    }

    private boardCodeToNumObject(code: string): {row: number, column: number} {
        return {row: +code.charAt(1) - 1 , 
            column: code.charAt(0).charCodeAt(0) - 65};
    }

    private numObjectToBoardCode(object: {row: number, column: number}): string {
        return String.fromCharCode(65 + object.column) + (object.row + 1);

    }
}