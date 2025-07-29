import { useNavigate } from "react-router-dom";

function StartPage(){
    const navigate = useNavigate();

    return(
        <div className="game">
            <h1> Memory game</h1>
            <p>Choose difficulty:</p>
            <div className="diff-buttons">
            <button className="easy-diff" onClick={() => navigate("/game/easy")}> Easy</button>
            <button className="med-diff" onClick={() => navigate("/game/medium")}> Medium</button>
            <button className="hard-diff" onClick={() => navigate("/game/hard")}> Hard</button>
            </div>
        </div>
    );
}

export default StartPage;