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
            console.log(this.gameOver())

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
        if (piece.getType() === PieceType.King) {
           moves.push(... this.getCastleMoves(input, player))
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
        const boardMemory: (Piece|null)[][] = this.boardstate.map(row => [...row]);
        
        //tests out move
        this.executeMove(possibleMoveSquare, startingSquare);
        
        //checks if king exposed
        const king: string = this.getPieces(player).filter(square => {
            const possibleKing = this.boardCodeToNumObject(square);
            return this.boardstate[possibleKing.row][possibleKing.column]?.getType() === PieceType.King
        })[0]
        const kingExposed: boolean = this.squareIsAttacked(king, player)

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

    private getCastleMoves(input: string, player: number): string[] {
        const moves: string[] = [];
        const moveTroughRight: string[] = [];
        const moveTroughLeft: string[] = []; 
        const startingSquare: {row: number, column: number} = this.boardCodeToNumObject(input);
        
        for (let i = -1; i > -4; i--) {
            const checkSquare: {row: number, column: number} = {row: startingSquare.row, column: startingSquare.column + i};
            if (this.boardstate[checkSquare.row][checkSquare.column] === null) {
                moveTroughLeft.push(this.numObjectToBoardCode(checkSquare));
            } else {
                break;
            }
        }
        const castleLeft: boolean = moveTroughLeft.length === 3 && !moveTroughLeft.some(square => this.squareIsAttacked(square, player))
        
        if (castleLeft) {
            const castleLeftNumOjectKing: {row: number, column: number} = {row: startingSquare.row, column: startingSquare.column - 2};
            const castleLeftNumOjectRookStart: {row: number, column: number} = {row: startingSquare.row, column: 0};
            const castleLeftNumOjectRook: {row: number, column: number} = {row: startingSquare.row, column: startingSquare.column - 1};

            moves.push(this.numObjectToBoardCode(castleLeftNumOjectKing));
            this.addFunction(this.numObjectToBoardCode(castleLeftNumOjectKing), (output) => {
                this.boardstate[castleLeftNumOjectRook.row][castleLeftNumOjectRook.column] = this.boardstate[castleLeftNumOjectRookStart.row][castleLeftNumOjectRookStart.column];
                this.boardstate[castleLeftNumOjectRookStart.row][castleLeftNumOjectRookStart.column] = null;
                output[0].push(... [this.numObjectToBoardCode(castleLeftNumOjectRookStart), this.numObjectToBoardCode(castleLeftNumOjectRook)]);
            })

        }

        // check squares 

        for (let i = 1 ; i < 3; i++) {
            const checkSquare: {row: number, column: number} = {row: startingSquare.row, column: startingSquare.column + i};
            if (this.boardstate[checkSquare.row][checkSquare.column] === null) {
                moveTroughRight.push(this.numObjectToBoardCode(checkSquare));
            } else {
                moveTroughRight.splice(0, moveTroughLeft.length);
                break;
            }
        }
        const castleRight: boolean = moveTroughRight.length === 2 && !moveTroughRight.some(square => this.squareIsAttacked(square, player))
        
        if (castleRight) {
            const castleRightNumOjectKing: {row: number, column: number} = {row: startingSquare.row, column: startingSquare.column + 2};
            const castleRightNumOjectRookStart: {row: number, column: number} = {row: startingSquare.row, column: 7};
            const castleRightNumOjectRook: {row: number, column: number} = {row: startingSquare.row, column: startingSquare.column + 1};

            moves.push(this.numObjectToBoardCode(castleRightNumOjectKing));
            this.addFunction(this.numObjectToBoardCode(castleRightNumOjectKing), (output) => {
                this.boardstate[castleRightNumOjectRook.row][castleRightNumOjectRook.column] = this.boardstate[castleRightNumOjectRookStart.row][castleRightNumOjectRookStart.column];
                this.boardstate[castleRightNumOjectRookStart.row][castleRightNumOjectRookStart.column] = null;
                output[0].push(... [this.numObjectToBoardCode(castleRightNumOjectRookStart), this.numObjectToBoardCode(castleRightNumOjectRook)])
            });

        }

        return moves;
    }

    private squareIsAttacked(checkSquare: string, player: number): boolean {
        const square: {row: number, column: number} = this.boardCodeToNumObject(checkSquare);
        const directions: {direction:{row: number, column: number}, types: PieceType[], looping: boolean}[] = 
            [{direction:{row: 1, column: 1}, types: [PieceType.Queen, PieceType.Bishop], looping: true},
            {direction:{row: 1, column: 0}, types: [PieceType.Queen, PieceType.Rook], looping: true},
            {direction:{row: 1, column: -1}, types: [PieceType.Queen, PieceType.Bishop], looping: true},
            {direction:{row: 0, column: 1}, types: [PieceType.Queen, PieceType.Rook], looping: true},
            {direction:{row: 0, column: -1}, types: [PieceType.Queen, PieceType.Rook], looping: true},
            {direction:{row: -1, column: 1}, types: [PieceType.Queen, PieceType.Bishop], looping: true},
            {direction:{row: -1, column: 0}, types: [PieceType.Queen, PieceType.Rook], looping: true},
            {direction:{row: 1, column: 1}, types: [PieceType.King], looping: false},
            {direction:{row: 1, column: 0}, types: [PieceType.King], looping: false},
            {direction:{row: 1, column: -1}, types: [PieceType.King], looping: false},
            {direction:{row: 0, column: 1}, types: [PieceType.King], looping: false},
            {direction:{row: 0, column: -1}, types: [PieceType.King], looping: false},
            {direction:{row: -1, column: 1}, types: [PieceType.King], looping: false},
            {direction:{row: -1, column: 0}, types: [PieceType.King], looping: false},
            {direction:{row: -1, column: -1}, types: [PieceType.King], looping: false},
            {direction:{row: -1, column: -1}, types: [PieceType.King], looping: false},
            {direction:{row: 1, column: 2}, types: [PieceType.Knight], looping: false},
            {direction:{row: 1, column: -2}, types: [PieceType.Knight], looping: false},
            {direction:{row: -1, column: 2}, types: [PieceType.Knight], looping: false},
            {direction:{row: -1, column: -2}, types: [PieceType.Knight], looping: false},
            {direction:{row: 2, column: 1}, types: [PieceType.Knight], looping: false},
            {direction:{row: 2, column: -1}, types: [PieceType.Knight], looping: false},
            {direction:{row: -2, column: 1}, types: [PieceType.Knight], looping: false},
            {direction:{row: -2, column: -1}, types: [PieceType.Knight], looping: false},
            {direction:{row: 1*(this.player), column: -1}, types: [PieceType.Pawn], looping: false},
            {direction:{row: 1*(this.player), column: 1}, types: [PieceType.Pawn], looping: false}];
        
        for (const direction of directions) {
            let possibleOpponent: {row: number, column: number} = {row: square.row + direction.direction.row, column: square.column + direction.direction.column}
            if (!this.squareOnBoard(possibleOpponent)) {
                continue;
            }
            let piece: Piece|null = this.boardstate[possibleOpponent.row][possibleOpponent.column]

            if (piece?.getPlayer() === player * (-1) && (direction.types.some(type => type === piece?.getType()))) {
                return true
            }

            while(this.squareOnBoard(possibleOpponent) && direction.looping) {
                piece = this.boardstate[possibleOpponent.row][possibleOpponent.column]
                if (piece === null) {
                    possibleOpponent = {row: possibleOpponent.row + direction.direction.row, column: possibleOpponent.column+ direction.direction.column}
                    continue;
                }
                if (piece.getPlayer() === player) {
                    break;
                }
                if (piece.getPlayer() === player * (-1) && (direction.types.some(type => type === piece?.getType()))) {
                    return true
                }
                break;
            }
        }

        return false
    }
        
    private gameOver(): boolean {
        
        const opponentHasMoves: boolean = this.getPieces(this.player)
        .some(piece => this.getMoves(piece, this.player).length > 0);

        console.log(this.getPieces(this.player)
        .map(piece => [ piece, this.getMoves(piece, this.player)]));
        
        if (opponentHasMoves) {
            console.log("blubbe")
            return false;
        }

        const opponentKing: {row: number, column: number} = this.getPieces(this.player)
            .map(square => this.boardCodeToNumObject(square))
            .filter(possibleKing => 
                this.boardstate[possibleKing.row][possibleKing.column]?.getType() === PieceType.King)[0];
        
        if (this.squareIsAttacked(this.numObjectToBoardCode(opponentKing), this.player)) {
            //do victory this.player
            return true;
        }
        //do stalemate
        return true
    }



    
}