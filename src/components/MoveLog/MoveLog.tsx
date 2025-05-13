import "./MoveLog.css"

interface moveLogProps {
    whiteName?: string;
    blackName?: string;
    whiteMoves: string[];
    blackMoves: string[];
}


export default function MoveLog({blackName, whiteName, whiteMoves, blackMoves}: moveLogProps) {
    return(
        <div className="move-log-background">
            <h2 id="move-log-heading">Move Log</h2>
            <h2 id="round-heading">Round</h2>
            <h2 id="white-log-heading"
                aria-label={"White log}"}
                >{whiteName ? whiteName : "White"}</h2>
            <h2 id="black-log-heading"
                aria-label={"Black log"}
                >{blackName ? blackName : "Black"}</h2>
            <ol id="round-counter">
                <li>1.</li>
                {Array.from(blackMoves.entries()).map(([id]) => (
                    <li key={id}>{id + 2}.</li>
                ))}
            </ol>
            <ol className="move-log"
                id="white-move-log">
                    {Array.from(whiteMoves.entries()).map(([id, move]) => (
                        <li key={id}>{move}</li>
                    ))}
            </ol>
            <ol className="move-log"
                id="black-move-log">
                    {Array.from(blackMoves.entries()).map(([id, move]) => (
                        <li key={id}>{move}</li>
                    ))} 
            </ol>
        </div>
    )
}