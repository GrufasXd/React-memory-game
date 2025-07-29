import { useParams } from "react-router-dom";
import React, { use, useEffect, useRef, useState } from "react"
import Card from "./Card.jsx"

function Memory_game(){
    const cards = ["😀", "😶‍🌫️", "👻", "🥶", "💀", "😇", "😎", "🤢", "👾", "🎃", "🤬", "🥸", "😍", "😈", "👺", "😺"];
    const {difficulty} = useParams();
    const [shuffleCards, setShuffledCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves, setmoves] = useState(0);
    const [pairsFound, setPairsFound] = useState(0);
    const [time, setTime] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const timerRef = useRef(null);
    const [isPreviewing, setPreview] = useState(true);

    const cols = difficulty === "easy" ? 4 : difficulty === "medium" ? 4 : 8;
    const rows = difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 4;

    useEffect(() => {
        let paircount = difficulty === "easy" ? 4 : difficulty === "medium" ? 8 : 16;
        const selected = shuffle(cards).slice(0, paircount);
        const pairedCards = shuffle([...selected, ...selected]);
        setShuffledCards(pairedCards);
        setPreview(true);

        const timeout = setTimeout(() => {
            setPreview(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [difficulty]);

    useEffect(() =>{
        timerRef.current = setInterval(() =>{
            setTime(prev => prev + 1)
        }, 1000);
        return() => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if(pairsFound === movesNeeded()){
            clearInterval(timerRef.current);
            setGameOver(true);
        }
    })

    function shuffle(array){
        let copy = [...array];
        let currentIndex = copy.length;

        while(currentIndex != 0){
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [copy[currentIndex], copy[randomIndex]] = [copy[randomIndex], copy[currentIndex]];
        }
        return copy;
    }

    function handleCardClick(index){
        if(flippedCards.includes(index) || matchedCards.includes(index) || flippedCards.length === 2) return;

        const newFlipped =[...flippedCards, index];
        setFlippedCards(newFlipped);

        if(newFlipped.length === 2){
            setmoves(prev => prev + 1);
            const [first, second] = newFlipped;
            if(shuffleCards[first] === shuffleCards[second]){
                const newMatched = [...matchedCards, first, second];
                setMatchedCards(newMatched);
                setPairsFound(prev => prev + 1);

                if(newMatched.length === movesNeeded()*2)
                    setTimeout(() => {
                    alert(`Nice, you found all the pairs! Time it took:${time} seconds, Moves: ${moves+1}`);
                }, 500);
            }
            setTimeout(() => {
            setFlippedCards([]);
            }, 500);
        }
    }

    function movesNeeded(){
        return difficulty === 'easy' ? 4 : difficulty === 'medium' ? 8 : 16;
    }

    return(
        <div className="board">
            <div className="game-stats">
                <span className="game-time">Time: {time} seconds</span>
                <span className="game-moves">Moves: {moves}</span>
                <span className="game-pairs">Pairs found: {pairsFound} / {movesNeeded()} </span>
            </div>
            <div className="card-grid"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, minmax(80px, 1fr))`,
                gridTemplateRows: `repeat(${rows}, auto)`,
                gap: "10px",
            }}>
                {shuffleCards.map((emoji, index) => (
                    <Card
                    key = {index}
                    emoji = {emoji}
                    isFlipped={isPreviewing || flippedCards.includes(index) || matchedCards.includes(index)}
                    onClick={() => handleCardClick(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default Memory_game