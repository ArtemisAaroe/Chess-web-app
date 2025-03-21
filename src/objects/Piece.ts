import { PieceType } from "../emums/Piece"; 
export class Piece {
    private type: PieceType;
    private player: number;
    private hasMoved: boolean;
    private movementMatrix: number[][];
    private movementIncremental: boolean;
    private enPassantRight: boolean;
    private enPassantLeft: boolean; 

    constructor(type: PieceType, player: number){
        this.type = type;
        this.player = player;
        this.hasMoved = false;
        this.movementMatrix = this.setMovementMatrix();
        this.movementIncremental = this.setMovementIncremental();
        this.enPassantRight = false;
        this.enPassantLeft = false;
      }

    

    private setMovementMatrix(): number[][] {
        switch (this.type) {
            case PieceType.Pawn:
                return [[1*(this.player), -1], [1*(this.player), 1], [1*(this.player), 0], [2*(this.player), 0]];
            case PieceType.Bishop:
                return [[1, 1], [1, -1], [-1, 1], [-1, -1]];
            case PieceType.Rook:
                return [[1, 0], [-1, 0], [0, 1], [0, -1]];
            case PieceType.Knight:
                return [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];
            case PieceType.King:
                return [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]];
            case PieceType.Queen:
                return [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]];
            default:
                throw new Error("Invalid PieceType" + this.type);
        }   
    }

    private setMovementIncremental(): boolean {
        switch (this.type) {
            case PieceType.Pawn:
                return true;
            case PieceType.Bishop:
                return false;
            case PieceType.Rook:
                return false;
            case PieceType.Knight:
                return true;
            case PieceType.King:
                return true;
            case PieceType.Queen:
                return false;
            default:
                throw new Error("Invalid PieceType" + this.type);
        }   
    }

    public moved(): void {
        this.hasMoved = true;
        this.enPassantLeft = false;
        this.enPassantRight = false;
    }

    public getType(): string {
        return PieceType[this.type];
    }

    public getPlayer(): number {
        return this.player;
    }

    public getHasMoved(): boolean {
        return this.hasMoved;
    }

    public getMovementMatrix(): number[][] {
        return this.movementMatrix;
    }

    public getMovementIncremental(): boolean {
        return this.movementIncremental;
    }

    public setEnPassantRightTrue(): void {
        this.enPassantRight = true;
    }
    
    public setEnPassantLeftTrue(): void {
        this.enPassantLeft = true;
    }
    
    public getEnPassantRight(): boolean {
        if (this.enPassantRight) {
            this.enPassantRight = false
            return true
        }
        return this.enPassantRight;
    }

    public getEnPassantLeft(): boolean {
        if (this.enPassantLeft) {
            this.enPassantLeft = false
            return true
        }
        return this.enPassantLeft;
    }

    public getPlayerColor(): string {
        if (this.player == 1) {
            return "White";
        } else if (this.player == -1) {
            return "Black";
        } else {
            throw new Error("Illegal player: " + this.player)
        }
    }
}

// todo: change player metadata to string and have private method for direction?