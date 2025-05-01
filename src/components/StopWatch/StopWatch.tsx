import "./StopWatch.css"
import { useState, useEffect, useCallback } from "react"; 



interface stopWatchProps {
    player: number;
}

export default function StopWatch({player}: stopWatchProps) {
    const [whiteTime, setWhiteTime] = useState(100)
    const [blackTime, setBlackTime] = useState(100)

    const displayTime = useCallback((time: number): string => {
        return `${String(Math.floor(time/3600)).padStart(2, "0")}:${String(Math.floor(time/60)).padStart(2, "0")}:${String(time%60).padStart(2, "0")}`
    }, [])

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
        <div className="clock">
            <h2>White</h2>
            <h2>Black</h2>
            <h2 className={player === 1 ? "highlight-time" : "unhighlighted-time"}>{displayTime(whiteTime)}</h2>
            <h2 className={player === (-1) ?  "highlight-time" : "unhighlighted-time"}>{displayTime(blackTime)}</h2>
        </div>
    )

}