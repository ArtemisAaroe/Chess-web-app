import "./BoardSquare.css"
import { Piece } from "../../objects/Piece";
import React, { CSSProperties } from 'react';


interface Props {
    piece: Piece | null;
    color: CSSProperties['color'];
    square: string;
    label: string;
    tabEnabled: boolean;
    dotEnabled: boolean;
    clickAction: (square: string) => void
}

const BoardSquare = React.memo(({ piece, color, square, label, tabEnabled, dotEnabled, clickAction }: Props) => {
    const squareColor: React.CSSProperties = {
        backgroundColor: color,
    }

    console.log(`../../assets/${piece?.getPlayerColor ? piece?.getPlayerColor() : undefined}${piece?.getType ? piece.getType() : undefined}.svg`)
    return(
        <button style={squareColor} 
            onClick={() => clickAction(square)} 
            className="BoardSquare"
            aria-label={label}
            title={"square: " + label + `${piece ? "\n" + piece.getPlayerColor() + " " + piece.getType() : ""}`}
            tabIndex={tabEnabled ? 0 : -1}>
            <img src={new URL(`../../assets/${piece?.getPlayerColor ? piece?.getPlayerColor() : "x"}${piece?.getType ? piece.getType() : "x"}.svg`, import.meta.url).href} 
                alt={piece ? piece.getType() : undefined}
                aria-label={piece ? piece.getPlayerColor() + " " + piece.getType() : "Empty square"} />
            {dotEnabled ? 
                <div className="dot"
                    aria-label="indicator of possible movement">
                </div>
                :
                null
            }   
        </button>
    );

});
export default BoardSquare;