import "./BoardSquare.css"
import { Piece } from "../../objects/Piece";
import React, { CSSProperties } from 'react';


interface Props {
    piece: Piece | null;
    color: CSSProperties['color'];
    square: string;
    clickAction: (square: string) => void
}

const BoardSquare = React.memo(({ piece, color, square, clickAction }: Props) => {
    const squareColor: React.CSSProperties = {
        backgroundColor: color,
    }

    console.log(`../../assets/${piece?.getPlayerColor ? piece?.getPlayerColor() : undefined}${piece?.getType ? piece.getType() : undefined}.svg`)
    return(
        <button style={squareColor} 
            onClick={() => clickAction(square)} 
            className="BoardSquare">
            <img src={new URL(`../../assets/${piece?.getPlayerColor ? piece?.getPlayerColor() : "x"}${piece?.getType ? piece.getType() : "x"}.svg`, import.meta.url).href} 
                alt={piece?.getType ? piece.getType() : undefined} />

        </button>
    );

});
export default BoardSquare;