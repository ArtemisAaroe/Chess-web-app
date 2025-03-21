import "./ChessPage.css"
import BoardSquare from "../BoardSquare/BoardSquare"
import { Piece } from "../../objects/Piece"
import { useCallback, useEffect, useRef, useState } from "react"
import { PieceType } from "../../emums/Piece"
import { Board } from "../../objects/Board"


export default function ChessPage() {
    const [boardstate, setBoardstate] = useState<Map<string, { piece: Piece | null; color: string }>>(new Map([        
        ["A8", { piece: new Piece(PieceType.Rook, -1), color: "#f0f0f" }],
        ["B8", { piece: new Piece(PieceType.Knight, -1), color: "#f0f0f" }],
        ["C8", { piece: new Piece(PieceType.Bishop, -1), color: "#f0f0f" }],
        ["D8", { piece: new Piece(PieceType.Queen, -1), color: "#f0f0f" }],
        ["E8", { piece: new Piece(PieceType.King, -1), color: "#f0f0f" }],
        ["F8", { piece: new Piece(PieceType.Bishop, -1), color: "#f0f0f" }],
        ["G8", { piece: new Piece(PieceType.Knight, -1), color: "#f0f0f" }],
        ["H8", { piece: new Piece(PieceType.Rook, -1), color: "#f0f0f" }],
    
        ["A7", { piece: new Piece(PieceType.Pawn, -1), color: "#f0f0f" }],
        ["B7", { piece: new Piece(PieceType.Pawn, -1), color: "#f0f0f" }],
        ["C7", { piece: new Piece(PieceType.Pawn, -1), color: "#f0f0f" }],
        ["D7", { piece: new Piece(PieceType.Pawn, -1), color: "#f0f0f" }],
        ["E7", { piece: new Piece(PieceType.Pawn, -1), color: "#f0f0f" }],
        ["F7", { piece: new Piece(PieceType.Pawn, -1), color: "#f0f0f" }],
        ["G7", { piece: new Piece(PieceType.Pawn, -1), color: "#f0f0f" }],
        ["H7", { piece: new Piece(PieceType.Pawn, -1), color: "#f0f0f" }],

        ["A6", { piece: null, color: "#f0f0f" }],
        ["B6", { piece: null, color: "#f0f0f" }],
        ["C6", { piece: null, color: "#f0f0f" }],
        ["D6", { piece: null, color: "#f0f0f" }],
        ["E6", { piece: null, color: "#f0f0f" }],
        ["F6", { piece: null, color: "#f0f0f" }],
        ["G6", { piece: null, color: "#f0f0f" }],
        ["H6", { piece: null, color: "#f0f0f" }],

        ["A5", { piece: null, color: "#f0f0f" }],
        ["B5", { piece: null, color: "#f0f0f" }],
        ["C5", { piece: null, color: "#f0f0f" }],
        ["D5", { piece: null, color: "#f0f0f" }],
        ["E5", { piece: null, color: "#f0f0f" }],
        ["F5", { piece: null, color: "#f0f0f" }],
        ["G5", { piece: null, color: "#f0f0f" }],
        ["H5", { piece: null, color: "#f0f0f" }],

        ["A4", { piece: null, color: "#f0f0f" }],
        ["B4", { piece: null, color: "#f0f0f" }],
        ["C4", { piece: null, color: "#f0f0f" }],
        ["D4", { piece: null, color: "#f0f0f" }],
        ["E4", { piece: null, color: "#f0f0f" }],
        ["F4", { piece: null, color: "#f0f0f" }],
        ["G4", { piece: null, color: "#f0f0f" }],
        ["H4", { piece: null, color: "#f0f0f" }],

        ["A3", { piece: null, color: "#f0f0f" }],
        ["B3", { piece: null, color: "#f0f0f" }],
        ["C3", { piece: null, color: "#f0f0f" }],
        ["D3", { piece: null, color: "#f0f0f" }],
        ["E3", { piece: null, color: "#f0f0f" }],
        ["F3", { piece: null, color: "#f0f0f" }],
        ["G3", { piece: null, color: "#f0f0f" }],
        ["H3", { piece: null, color: "#f0f0f" }],
    
        ["A2", { piece: new Piece(PieceType.Pawn, 1), color: "#f0f0f" }],
        ["B2", { piece: new Piece(PieceType.Pawn, 1), color: "#f0f0f" }],
        ["C2", { piece: new Piece(PieceType.Pawn, 1), color: "#f0f0f" }],
        ["D2", { piece: new Piece(PieceType.Pawn, 1), color: "#f0f0f" }],
        ["E2", { piece: new Piece(PieceType.Pawn, 1), color: "#f0f0f" }],
        ["F2", { piece: new Piece(PieceType.Pawn, 1), color: "#f0f0f" }],
        ["G2", { piece: new Piece(PieceType.Pawn, 1), color: "#f0f0f" }],
        ["H2", { piece: new Piece(PieceType.Pawn, 1), color: "#f0f0f" }],
    
        ["A1", { piece: new Piece(PieceType.Rook, 1), color: "#f0f0f" }],
        ["B1", { piece: new Piece(PieceType.Knight, 1), color: "#f0f0f" }],
        ["C1", { piece: new Piece(PieceType.Bishop, 1), color: "#f0f0f" }],
        ["D1", { piece: new Piece(PieceType.Queen, 1), color: "#f0f0f" }],
        ["E1", { piece: new Piece(PieceType.King, 1), color: "#f0f0f" }],
        ["F1", { piece: new Piece(PieceType.Bishop, 1), color: "#f0f0f" }],
        ["G1", { piece: new Piece(PieceType.Knight, 1), color: "#f0f0f" }],
        ["H1", { piece: new Piece(PieceType.Rook, 1), color: "#f0f0f" }],
    
    ]));

    const changePiece = useCallback((square: string, piece: Piece | null): void => {
        setBoardstate((boardstate) => {
            const newBoardstate = new Map(boardstate);
            const entry = newBoardstate.get(square)
            if (!entry) {
                return boardstate;
            }
            newBoardstate.set(square, {color: entry?.color, piece: piece});
            return newBoardstate;
        });
    }, []);

    const [board] = useState(() => new Board(boardstate, changePiece));
    
    const movePiece = useCallback((moves: string[]):void => {   
        setBoardstate((boardstate) => {
            const newBoardstate = new Map(boardstate);
            const move: {from: string, to: string} =  {from: "", to: ""}
            let i: number = 0;

            while (moves.length > i) {
                console.log("blubbe")
                move.from = moves[i];
                i++;
                move.to = moves[i];
                i++;
                if (move.from === "") {
                    newBoardstate.set(move.to, {color: "#f0f0f", piece: null})
                    continue;
                }
                const entry = newBoardstate.get(move.from)

                if (!entry || !entry.piece) {
                    console.warn(`Invalid move format: ${move}`);
                    continue;
                }
                newBoardstate.set(move.to, {color: "#f0f0f", piece: entry?.piece})
                newBoardstate.set(move.from, {color: "#f0f0f", piece: null})
            }
            return newBoardstate;
            
        });
    },[setBoardstate])


    const colorSquare = useCallback((squaresNew: string[], squaresOld: string[]): void => {
        setBoardstate((boardstate) => {
            const newBoardstate = new Map(boardstate)
            for (const square of squaresOld) {
                const entry = newBoardstate.get(square)
                if (!entry) {
                    continue
                }
                newBoardstate.set(square, {color: "#f0f0f0", piece: entry?.piece})
            }
            for (const square of squaresNew) {
                const entry = newBoardstate.get(square)
                if (!entry) {
                    continue
                }
                newBoardstate.set(square, {color: "#FFFF00", piece: entry?.piece})
            }
            return newBoardstate;
        });
    }, [setBoardstate])

    const getInput = useCallback((square: string): void => {        
        const output: string[][] = board.input(square); 
        if (output[0].length > 0) {
            movePiece(output[0])
        }
        if (output[1].length > 0) {
            colorSquare(output[1], output[2]);
        }
    }, [board, colorSquare, movePiece]);

    const firstRun = useRef(true);

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            const output: string[][] = board.start();
            colorSquare(output[1], output[2]);
        }
    }, []);



    return(
        <figure className="board">
            {Array.from(boardstate.entries()).map(([id, { piece, color }]) => (
                <BoardSquare 
                    key={id}
                    piece={piece} 
                    color={color} 
                    square={id} 
                    clickAction={getInput} 
                />
            ))}
            
        </figure>
    )
}