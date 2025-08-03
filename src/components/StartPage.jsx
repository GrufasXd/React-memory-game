import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StartPage(){
    const navigate = useNavigate();
    const [player_name, setname] = useState("");
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const topResults = leaderboard
        .sort((a,b) => a.time - b.time)
        .slice(0,10);

    return(
        <div className="game">
            <h1> Memory game</h1>
            <input className="name_input"
            type="text"
            placeholder="Insert name..."
            value={player_name}
            onChange={(e) => setname(e.target.value)}
             />
            <p>Choose difficulty:</p>
            <div className="diff-buttons">
                <button className="easy-diff" onClick={() => {
                    if(!player_name.trim()){
                        alert("Enter your name before selecting the difficulty.");
                        return;
                    }
                    localStorage.setItem("player_name", player_name);
                    navigate("/game/easy");}}>Easy</button>
                <button className="med-diff" onClick={() => {
                    if(!player_name.trim()){
                        alert("Enter your name before selecting the difficulty.");
                        return;
                    }
                    localStorage.setItem("player_name", player_name);
                    navigate("/game/medium");}}>Medium</button>
                <button className="hard-diff" onClick={() => {
                    if(!player_name.trim()){
                        alert("Enter your name before selecting the difficulty.");
                        return;
                    }
                    localStorage.setItem("player_name", player_name);
                    navigate("/game/hard");}}>Hard</button>
            </div>
            <div className="leaderboard-wrap">
                <div className="leaderboard">
                <h2>Leaderboard</h2>
                <ul>
                    {topResults.map((entry, index) => (
                        <li key = {index}>
                            {entry.name} - {entry.time}s, {entry.moves} moves ({entry.difficulty})
                        </li>
                    ))}
                </ul>
                </div>
                {leaderboard.length > 0 &&(
                <button className = "reset-leaderboard" onClick={() => {
                localStorage.removeItem("leaderboard");
                window.location.reload();
                }}>Reset leaderboard</button>)}
            </div>
            <button className="expert-diff" onClick={() => {
                localStorage.setItem("player_name", player_name);
                navigate("/game/expert");}}>Expert</button>
        </div>
    );
}

export default StartPage;