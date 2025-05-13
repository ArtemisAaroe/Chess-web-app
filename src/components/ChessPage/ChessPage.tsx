import "./ChessPage.css"
import BoardSquare from "../BoardSquare/BoardSquare"
import StopWatch from "../StopWatch/StopWatch"
import { Piece } from "../../objects/Piece"
import { useCallback, useEffect, useRef, useState } from "react"
import { PieceType } from "../../emums/Piece"
import { Board } from "../../objects/Board"
import PromotionView from "../PromotionView/PromotionView"
import { isPieceType } from "../../emums/Piece"
import { ChessType } from "../../emums/Chess"
import MoveLog from "../MoveLog/MoveLog"


export default function ChessPage() {
    const [boardstate, setBoardstate] = useState<Map<string, { piece: Piece | null; color: string; tabEnabled: boolean; dotEnabled: boolean }>>(new Map([
        ["A8", { piece: new Piece(PieceType.Rook, -1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["B8", { piece: new Piece(PieceType.Knight, -1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["C8", { piece: new Piece(PieceType.Bishop, -1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["D8", { piece: new Piece(PieceType.Queen, -1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["E8", { piece: new Piece(PieceType.King, -1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["F8", { piece: new Piece(PieceType.Bishop, -1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["G8", { piece: new Piece(PieceType.Knight, -1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["H8", { piece: new Piece(PieceType.Rook, -1), color: "white", tabEnabled: false, dotEnabled: false }],
    
        ["A7", { piece: new Piece(PieceType.Pawn, -1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["B7", { piece: new Piece(PieceType.Pawn, -1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["C7", { piece: new Piece(PieceType.Pawn, -1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["D7", { piece: new Piece(PieceType.Pawn, -1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["E7", { piece: new Piece(PieceType.Pawn, -1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["F7", { piece: new Piece(PieceType.Pawn, -1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["G7", { piece: new Piece(PieceType.Pawn, -1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["H7", { piece: new Piece(PieceType.Pawn, -1), color: "black", tabEnabled: false, dotEnabled: false }],
    
        ["A6", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["B6", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["C6", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["D6", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["E6", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["F6", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["G6", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["H6", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
    
        ["A5", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["B5", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["C5", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["D5", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["E5", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["F5", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["G5", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["H5", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
    
        ["A4", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["B4", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["C4", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["D4", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["E4", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["F4", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["G4", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["H4", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
    
        ["A3", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["B3", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["C3", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["D3", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["E3", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["F3", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
        ["G3", { piece: null, color: "white", tabEnabled: false, dotEnabled: false }],
        ["H3", { piece: null, color: "black", tabEnabled: false, dotEnabled: false }],
    
        ["A2", { piece: new Piece(PieceType.Pawn, 1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["B2", { piece: new Piece(PieceType.Pawn, 1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["C2", { piece: new Piece(PieceType.Pawn, 1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["D2", { piece: new Piece(PieceType.Pawn, 1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["E2", { piece: new Piece(PieceType.Pawn, 1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["F2", { piece: new Piece(PieceType.Pawn, 1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["G2", { piece: new Piece(PieceType.Pawn, 1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["H2", { piece: new Piece(PieceType.Pawn, 1), color: "white", tabEnabled: false, dotEnabled: false }],
    
        ["A1", { piece: new Piece(PieceType.Rook, 1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["B1", { piece: new Piece(PieceType.Knight, 1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["C1", { piece: new Piece(PieceType.Bishop, 1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["D1", { piece: new Piece(PieceType.Queen, 1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["E1", { piece: new Piece(PieceType.King, 1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["F1", { piece: new Piece(PieceType.Bishop, 1), color: "black", tabEnabled: false, dotEnabled: false }],
        ["G1", { piece: new Piece(PieceType.Knight, 1), color: "white", tabEnabled: false, dotEnabled: false }],
        ["H1", { piece: new Piece(PieceType.Rook, 1), color: "black", tabEnabled: false, dotEnabled: false }],
    ]));
    

    const [board] = useState(() => new Board(boardstate));

    const [player, setPlayer] = useState(1);

    const [displayPromotionView, setDisplayPromotionView] = useState(false);

    const [PromotionViewSquare, setPromotionViewSquare] = useState("")

    const [whiteMoves, setWhiteMoves] =  useState<string[]>([]);

    const [blackMoves, setBlackMoves] =  useState<string[]>([]);

    const whitePlayer: string = "cat"
    const blackPlayer: string = "moon";
    const chessStyle: ChessType = ChessType.Classical;

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
                const entryFrom = newBoardstate.get(move.from)
                const entryTo = newBoardstate.get(move.to)
                if (!entryFrom || !entryFrom.piece) {
                    throw console.error(`Invalid move format, expected mistake in .from: ${move.from}`);
                    
                }
                if (move.to === "") {
                    newBoardstate.set(move.to, 
                        {color: entryFrom.color, 
                        piece: null, 
                        tabEnabled: entryFrom.tabEnabled, 
                        dotEnabled: entryFrom.dotEnabled})
                    continue;
                }

                if (move.to.length > 2) {
                    setPlayer(player * (-1))
                    if (isPieceType(move.to)) {
                        newBoardstate.set(move.from, {
                            color: entryFrom.color, 
                            piece: new Piece(move.to as PieceType, entryFrom.piece.getPlayer()), 
                            tabEnabled: entryFrom.tabEnabled, 
                            dotEnabled: entryFrom.dotEnabled});
                    } else {
                        throw console.error(move.to + " read as longer then two digits, but could not be cast to PieceType");   
                    }
                    continue;
                }
                if (!entryTo) {
                    throw console.error(`Invalid move format, expected mistake in .to: ${move}`);
                }
                newBoardstate.set(move.to, 
                    {color: entryTo.color, 
                    piece: entryFrom.piece,
                    tabEnabled: entryTo.tabEnabled,
                    dotEnabled: entryTo.dotEnabled})
                newBoardstate.set(move.from, 
                    {color: entryFrom.color, 
                    piece: null,
                    tabEnabled: entryFrom.tabEnabled,
                    dotEnabled: entryFrom.dotEnabled})
                if (player === 1) {
                    setWhiteMoves(prevMoves => [...prevMoves, move.to])
                } else {
                    setBlackMoves(prevMoves => [...prevMoves, move.to])
                }
            }
            setPlayer(player * (-1))
            return newBoardstate;

        });
    },[setBoardstate, player])

    const updateUIIndicators = useCallback((piecesOnSquare: string[], deselectSquares: string[], possibleMoves: string[], deselectMoves: string[]): void => {
        setBoardstate((boardstate) => {
            const newBoardstate = new Map(boardstate);
            for (const square of deselectSquares) {
                const entry = newBoardstate.get(square)
                if (!entry) {
                    continue
                }
                newBoardstate.set(square, {color: entry.color, piece: entry?.piece, tabEnabled: false, dotEnabled: entry.dotEnabled})
            }          
            for (const square of deselectMoves) {
                const entry = newBoardstate.get(square)
                if (!entry) {
                    continue
                }
                newBoardstate.set(square, {color: entry.color, piece: entry?.piece, tabEnabled: false, dotEnabled: false})
            }
            for (const square of piecesOnSquare) {
                const entry = newBoardstate.get(square)
                if (!entry) {
                    continue
                }
                newBoardstate.set(square, {color: entry.color, piece: entry?.piece, tabEnabled: true, dotEnabled: entry.dotEnabled})
            }
            for (const square of possibleMoves) {
                const entry = newBoardstate.get(square)
                if (!entry) {
                    continue
                }
                newBoardstate.set(square, {color: entry.color, piece: entry?.piece, tabEnabled: true, dotEnabled: true})
            }
            return newBoardstate
        });
    }, [setBoardstate])

    const openPromotionView = useCallback((squares: string[]): void => {
        setPromotionViewSquare(squares[0])
        setDisplayPromotionView(true)
    }, [])

    //output[0] = move
    //output[1] = promotion
    //output[2] = tabselect
    //output[3] = tabdeselect
    //output[4] = dotselect
    //output[5] = dotdeselect
    const getInput = useCallback((square: string): void => {   
        const output: string[][] = board.input(square); 
        console.log(output)     
        if (output[0].length > 0) {
            movePiece(output[0]);
        }
        updateUIIndicators(output[2], output[3], output[4], output[5]);
        if (output[1].length > 0) {
            openPromotionView(output[1]);
        }
    }, [board, movePiece,updateUIIndicators, openPromotionView]);

    const firstRun = useRef(true);

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            const output: string[][] = board.start();
            updateUIIndicators(output[2], output[3], output[4], output[5]);
        }
    }, [updateUIIndicators]);



    return(
        <div className="background-in-game">
            <header className="game-banner">
                <h1>{chessStyle} Chess</h1>
                <h2>{whitePlayer} vs {blackPlayer}</h2>
            </header>

            <div className="board-boarder" role="grid" aria-label="chessboard with markers for rows and columns">
                {Array.from(["", "A", "B", "C", "D", "E", "F", "G", "H", "",
                    "8", "8", "7", "7", "6", "6", "5", "5", "4", "4",
                    "3", "3", "2", "2", "1", "1", "", "A", "B", "C",
                    "D", "E", "F", "G", "H", ""
                    ].entries()).map(([key, string]) => (
                        string === "" ? (
                            <div 
                                key={key}
                                className="boarder-piece"
                                aria-label="corner piece"/>
                        ) : (
                            <div 
                                key={key}
                                className="border-piece" 
                                aria-label={/^[0-9]$/.test(string) ? `row: ${string}` : `column: ${string}`}>
                                <h3>{string}</h3>
                            </div>
                        )
                    ))} 
                <div className="board" role="gird" aria-label="chessboard">
                    {Array.from(boardstate.entries()).map(([id, { piece, color, tabEnabled, dotEnabled }]) => (
                        <BoardSquare 
                            key={id}
                            piece={piece} 
                            color={color} 
                            square={id} 
                            label={id}
                            clickAction={getInput} 
                            tabEnabled={tabEnabled} 
                            dotEnabled={dotEnabled} 
                        />
                    ))}       
                </div>
            </div>
            <StopWatch player={player} chessType={chessStyle}/>
            <MoveLog whiteMoves={whiteMoves} blackMoves={blackMoves}/>
            <PromotionView 
                player={player} 
                display={displayPromotionView} 
                setDisplay={setDisplayPromotionView} 
                square={PromotionViewSquare}
                sendInput={(square: string, pieceType: PieceType) => board.promotePawn(square, pieceType)}
                changePiece={(square: string, pieceType: string) => movePiece([square, pieceType])}/>
        </div>

    )
}