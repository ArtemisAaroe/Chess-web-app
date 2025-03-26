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
    private functionMap: Map<string, Array<(arg: string[][]) => void>>;

    constructor(boardstate: Map<string, { piece: Piece | null; color: string }>) {
        this.mode = ModeType.Start
        this.player = 1
        this.moves = 0
        this.bufferList = []
        this.selectedPiece = ""
        this.functionMap = new Map();
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
        const output: string[][] = [[],[],[],[]]
        if (!this.bufferList.includes(input)) {
            this.selectedPiece = "";
            this.mode = ModeType.PieceSelect;
            console.log("this.getPieces")
            //console.log(this.boardstate);
            output[1].push(... this.getPieces(this.player));

            
        } else if (this.mode === ModeType.PieceSelect) {
            this.mode = ModeType.MoveSelect;
            this.selectedPiece = input;
            console.log("this.getMoves");
            //console.log ("mode: " + this.mode + " player: " + this.player + " moves: " + this.moves + " bufferList: " + this.bufferList + " selectedPiece: " + this.selectedPiece)
            output[1].push(... this.getMoves(input, this.player));

            
        } else if (this.mode === ModeType.MoveSelect) {
            this.mode = ModeType.PieceSelect;
            
            
            console.log("this.executeMove")
            //console.log(this.boardstate)
            const square: {row: number, column: number} = this.boardCodeToNumObject(this.selectedPiece);
            this.boardstate[square.row][square.column]?.moved();
            output[0].push(... this.executeMove(input, this.selectedPiece));
            
            this.functionMap.get(input)?.forEach(func => func(output));
            this.functionMap = new Map();
            
            //console.log(this.boardstate)
            this.player = this.player * (-1);
            output[1].push(... this.getPieces(this.player));
            this.moves += 1;
            this.selectedPiece = "";
            this.mode = ModeType.PieceSelect;

        } else {
            throw new Error("the state of this object is broken");
        }
        output[2].push(... this.bufferList);
        this.bufferList = output[1];
        return output;
    }

    public promotePawn(square: string, pieceType: PieceType): void {
        const promotionSquare: {row: number, column: number} = this.boardCodeToNumObject(square);
        if (!this.boardstate[promotionSquare.row][promotionSquare.column]?.promote(pieceType)) {
            throw console.error("promotion of piece on " + square + "failed");
        }
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
        const startingSquare: {row: number, column: number} = this.boardCodeToNumObject(input);
        const piece: Piece|null = this.boardstate[startingSquare.row][startingSquare.column];
        
        if (piece === null) {
            throw new Error(input + "is not a piece");
        }
        if (piece.getPlayer() !== player) {
            throw new Error(input + " is " + piece.getPlayerColor() + " and not piece of player");
        }
        if (piece.getType() === PieceType.Pawn) {
            return this.getPawnMoves(moves, startingSquare, piece, player)
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
            if (this.doesMoveExposeKing(this.numObjectToBoardCode(startingSquare), this.numObjectToBoardCode(possibleMoveSquare), player)) {
                continue;
            }

            moves.push(this.numObjectToBoardCode(possibleMoveSquare));
            
            
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
                if (this.doesMoveExposeKing(this.numObjectToBoardCode(startingSquare), this.numObjectToBoardCode(possibleMoveSquare), player)) {
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
    private executeMove(input: string, selectedPiece: string): string[] {
        const oldSquare: {row: number, column: number} = this.boardCodeToNumObject(selectedPiece);
        const piece: Piece|null = this.boardstate[oldSquare.row][oldSquare.column];
        const newSquare: {row: number, column: number} = this.boardCodeToNumObject(input);
        
        this.boardstate[oldSquare.row][oldSquare.column] = null;
        this.boardstate[newSquare.row][newSquare.column] = piece;
        
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

    private doesMoveExposeKing(startingSquare: string, possibleMoveSquare: string, player: number): boolean {
        if (player !== this.player) {
            return false;
        }
        const boardMemory: (Piece|null)[][] = this.boardstate.map(row => [...row]);
        
        //tests out move
        this.executeMove(possibleMoveSquare, startingSquare);
        
        //checks if king exposed
        const king: string = this.getPieces(player).filter(square => {
            const possibleKing = this.boardCodeToNumObject(square);
            if (this.boardstate[possibleKing.row][possibleKing.column]?.getType() === PieceType.King) {
                return this.numObjectToBoardCode(possibleKing);
            } 
        })[0]
        const kingExposed: boolean = this.getPieces(player * (-1))
            .flatMap(opponentPiece => this.getMoves(opponentPiece, player * (-1)))
            .some(square => king === square)

        //resets board
        this.boardstate = boardMemory;
        return kingExposed
    }

    private getPawnMoves(moves: string[], startingSquare: {row: number, column: number}, piece: Piece, player: number): string[] {
        let i = -1
        for (const direction of piece.getMovementMatrix()) {
            i++;
            const possibleMoveSquare: {row: number, column: number} = { 
                row: startingSquare.row + direction[0], 
                column: startingSquare.column + direction[1] 
            };
            
            if (!this.squareOnBoard(possibleMoveSquare)) {
                continue;
            }
            
            const squarePlayer = this.boardstate[possibleMoveSquare.row][possibleMoveSquare.column]?.getPlayer();
            if (i === 0) {
                if (squarePlayer === undefined) {
                    if (piece.getEnPassantLeft()) {
                        this.addFunction(this.numObjectToBoardCode(possibleMoveSquare), (output: string[][]) => {
                            this.boardstate[possibleMoveSquare.row + player * (-1)][possibleMoveSquare.column] = null;
                            output[0].push(... ["", this.numObjectToBoardCode({row: possibleMoveSquare.row + player * (-1), column: possibleMoveSquare.column})])               
                        });
                    } else {
                        continue;
                    }
                } else if (squarePlayer === player) {
                    continue;
                }
            }
            if (i === 1) {
                if (squarePlayer === undefined) {
                    if (piece.getEnPassantRight()) {
                        this.addFunction(this.numObjectToBoardCode(possibleMoveSquare), (output: string[][]) => {
                            this.boardstate[possibleMoveSquare.row + player * (-1)][possibleMoveSquare.column] = null
                            output[0].push(... [ "", this.numObjectToBoardCode({row: possibleMoveSquare.row + player * (-1), column: possibleMoveSquare.column})])                                 });
                    } else {
                        continue;
                    }
                } else if (squarePlayer === player) {
                    continue;
                }
            }
            if (i === 2 && squarePlayer !== undefined) {
                break;
            } 
            if (i === 3) {
                if (piece.getHasMoved()) {
                    continue
                }
                if (squarePlayer !== undefined) {
                    continue
                }
                
                const pieceLeft: Piece | null = this.boardstate[possibleMoveSquare.row][possibleMoveSquare.column - 1];
                if (pieceLeft?.getPlayer() === player * (-1) && pieceLeft?.getType() === PieceType.Pawn ) {
                    this.addFunction(this.numObjectToBoardCode(possibleMoveSquare), () => pieceLeft.setEnPassantRightTrue())
                }

                const pieceRight: Piece | null = this.boardstate[possibleMoveSquare.row][possibleMoveSquare.column + 1]
                if (pieceRight?.getPlayer() === player * (-1) && pieceRight?.getType() === PieceType.Pawn ) {
                    this.addFunction(this.numObjectToBoardCode(possibleMoveSquare), () => pieceRight.setEnPassantLeftTrue())
                }

            }

            if (this.doesMoveExposeKing(this.numObjectToBoardCode(startingSquare), this.numObjectToBoardCode(possibleMoveSquare), player)) {
                continue;
            }

            if (possibleMoveSquare.row === 0 || possibleMoveSquare.row === 7) {
                this.addFunction(this.numObjectToBoardCode(possibleMoveSquare), (output) => {
                    this.boardstate[possibleMoveSquare.row][possibleMoveSquare.column] = new Piece(PieceType.Queen, piece.getPlayer());
                    output[3].push(this.numObjectToBoardCode(possibleMoveSquare));
                });
            }
            moves.push(this.numObjectToBoardCode(possibleMoveSquare));  
        }
        //console.log(moves)
        return moves;
    }

    private addFunction(key: string, func: (output: string[][]) => void): void {
        if (!this.functionMap.has(key)) {
          this.functionMap.set(key, []);
        }
        this.functionMap.get(key)!.push(func);
      }
}