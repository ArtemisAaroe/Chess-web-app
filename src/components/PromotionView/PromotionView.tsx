


import "./PromotionView.css"
import BoardSquare from "../BoardSquare/BoardSquare"
import { Piece } from "../../objects/Piece"
import { PieceType } from "../../emums/Piece"
import { Dispatch } from "react"
import { SetStateAction } from "react"

type PromotionViewProps = {
    player: number;
    display: boolean
    setDisplay: Dispatch<SetStateAction<boolean>>
    square: string
    sendInput: (input: string, type: PieceType) => void
    changePiece: (square: string, type: string) => void
  };
  

export default function PromotionView({player, display, setDisplay, square, sendInput, changePiece}: PromotionViewProps) {
  const onSelect = (pieceType: string):void  => {
    setDisplay(false)
    changePiece(square, pieceType)
    sendInput(square, pieceType as PieceType)
  }

  
  
  return display ? (
        <div className="overlay">
            <figure className="promotion-view">
            {[PieceType.Queen, PieceType.Knight, PieceType.Rook, PieceType.Bishop].map((type) => (
              <BoardSquare
                key={type}
                piece={new Piece(type, player)}
                color="#f0f0f"
                square={square}
                clickAction={() => onSelect(type)} // Resolve promise when clicked
              />
            ))}
            </figure>
        </div>
    ) : null;
}


