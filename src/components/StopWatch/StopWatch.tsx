import { ChessType } from "../../emums/Chess";
import "./StopWatch.css"
import { useState, useEffect, useCallback, useRef } from "react"; 

function usePrevious<T>(value: T) {
    const ref = useRef<T>()
    useEffect(() => { ref.current = value }, [value])
    return ref.current
  }

interface stopWatchProps {
    player: number;
    chessType: ChessType;
    whiteName?: string;
    blackName?: string;
}

export default function StopWatch({player, chessType, whiteName, blackName}: stopWatchProps) {
    const startingTime: number = setStartingTime(chessType)
    const standardAddTime: number = setStandardAddTime(chessType)
    const [whiteTime, setWhiteTime] = useState(startingTime)
    const [blackTime, setBlackTime] = useState(startingTime)
    const [whiteRound, setWhiteRound] = useState(1);
    const [blackRound, setBlackRound] = useState(0);
    const classicExtraTime: number = 1800;

    const displayTime = useCallback((time: number): string => {
        return `${String(Math.floor(time/3600)).padStart(2, "0")}:
            ${String(Math.floor((time%3600)/60)).padStart(2, "0")}:
            ${String(time%60).padStart(2, "0")}`;
    }, [])

    function setStartingTime(chessType: ChessType): number {
        switch (chessType) {
            case ChessType.Classical:
                return 5400;
            case ChessType.Rapid:
                return 900;
            case ChessType.Blitz:
                return 180;
            case ChessType.Bullet:
                return 120;
        }
    }

    function setStandardAddTime(chessType: ChessType): number {
        switch (chessType) {
            case ChessType.Classical:
                return 30;
            case ChessType.Rapid:
                return 10;
            case ChessType.Blitz:
                return 3;
            case ChessType.Bullet:
                return 1;
        }
    }

    const prevPlayer = usePrevious(player)

    useEffect(() => {
        //stopes from render on mount
    if (prevPlayer == null || prevPlayer === player) return

        if (player === 1) {
            setWhiteRound(prevWhiteRound => {
                const nextWhiteRound = prevWhiteRound + 1;
                setBlackTime(prevBlackTime => prevBlackTime + standardAddTime + 
                    ((chessType === ChessType.Classical && nextWhiteRound === (40 + 1)) ? classicExtraTime : 0)
                );
                return nextWhiteRound
            });
        } else {
            setBlackRound(prevBlackRound => {
                const nextBlackRound = prevBlackRound + 1;
                setWhiteTime(prevWhiteTime => prevWhiteTime + standardAddTime + 
                    ((chessType === ChessType.Classical && nextBlackRound === 40) ? classicExtraTime : 0)
                );
                return nextBlackRound;
            });
        }
    }, [player])

    useEffect(() => {
        if ((whiteTime <= 0 && player === 1) || (blackTime<= 0 && player === (-1))) {
            return;
        }
    
        const interval = setInterval(() => {
            if (player === 1) {
                setWhiteTime(prev => prev - 1)
            } else {
                setBlackTime(prev => prev - 1)
            }
        }, 1000);
    
        return () => clearInterval(interval);
      }, [player, blackTime, whiteTime  ]);

    
    return(
        <div className="clock" 
            role="grid"
            aria-label="Clock denoting time left for white and black player">
            <h2 aria-label={`White clock: ${whiteTime}`}
                >{whiteName ? whiteName : "White"} ({whiteRound})</h2>
            <h2 aria-label={`Black clock: ${blackTime}`}
                >{blackName ? blackName : "Black"} ({blackRound})</h2>
            <h2 className={player === 1 ? "highlight-time" : "unhighlighted-time"}
                >{displayTime(whiteTime)}</h2>
            <h2 className={player === (-1) ?  "highlight-time" : "unhighlighted-time"}>{displayTime(blackTime)}</h2>
        </div>
    )

}