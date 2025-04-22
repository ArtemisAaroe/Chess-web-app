import "./ChessPage.css"
import BoardSquare from "../BoardSquare/BoardSquare"
import { Piece } from "../../objects/Piece"
import { useCallback, useEffect, useRef, useState } from "react"
import { PieceType } from "../../emums/Piece"
import { Board } from "../../objects/Board"
import PromotionView from "../PromotionView/PromotionView"
import { isPieceType } from "../../emums/Piece"

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

    const [board] = useState(() => new Board(boardstate));

    const [player, setPlayer] = useState(1);

    const [displayPromotionView, setDisplayPromotionView] = useState(false);

    const [PromotionViewSquare, setPromotionViewSquare] = useState("")

    const movePiece = useCallback((moves: string[]):void => {   
        setBoardstate((boardstate) => {
            const newBoardstate = new Map(boardstate);
            const move: {from: string, to: string} =  {from: "", to: ""}
            let i: number = 0;

            while (moves.length > i) {
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

                if (move.to.length > 2) {
                    setPlayer(player * (-1))
                    if (isPieceType(move.to)) {
                        newBoardstate.set(move.from, {color: "#f0f0f", piece: new Piece(move.to as PieceType, entry.piece.getPlayer())});
                    } else {
                        throw console.error(move.to + " read as longer then two digits, but could not be cast to PieceType");
                        
                    }
                    continue;
                }
                newBoardstate.set(move.to, {color: "#f0f0f", piece: entry?.piece})
                newBoardstate.set(move.from, {color: "#f0f0f", piece: null})
            }
            setPlayer(player * (-1))
            return newBoardstate;

        });
    },[setBoardstate, player])


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

    const openPromotionView = useCallback((squares: string[]): void => {
        setPromotionViewSquare(squares[0])
        setDisplayPromotionView(true)

    }, [])

    const getInput = useCallback((square: string): void => {        
        const output: string[][] = board.input(square); 
        if (output[0].length > 0) {
            movePiece(output[0])
        }
        if (output[1].length > 0) {
            colorSquare(output[1], output[2]);
        }
        if (output[3].length > 0) {
            openPromotionView(output[3]);
        }
    }, [board, colorSquare, movePiece, openPromotionView]);

    const firstRun = useRef(true);

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            const output: string[][] = board.start();
            colorSquare(output[1], output[2]);
        }
    }, []);



    return(
        <div>
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
            <PromotionView 
                player={player} 
                display={displayPromotionView} 
                setDisplay={setDisplayPromotionView} 
                square={PromotionViewSquare}
                sendInput={(square: string, pieceType: PieceType) => board.promotePawn(square, pieceType)}
                changePiece={(square: string, pieceType: string) => movePiece([square, pieceType])}/>
            <button onClick={() => setDisplayPromotionView(true)}></button>

        </div>

    )
}