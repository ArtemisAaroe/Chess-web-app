export enum PieceType {
    Pawn = "Pawn",
    Rook = "Rook",
    Knight = "Knight",
    Bishop = "Bishop",
    Queen = "Queen",
    King = "King"
}

export function isPieceType(value: string): boolean {
    return Object.values(PieceType).includes(value as PieceType) }