import { useParams } from "react-router-dom";
import React, { use, useEffect, useRef, useState } from "react"
import Card from "./Card.jsx"
import { useNavigate } from "react-router-dom";
import limboMusic from "/assets/limbo_song.mp3";

function Memory_game(){
    const cards = ["😀", "😶‍🌫️", "👻", "🥶", "💀", "😇", "😎", "🤢", "👾", "🎃", "🤬", "🥸", "😍", "😈", "👺", "😺", "💩", "🤯", "🤒", "🤫", "😤", "🥹", "🤓", "👹", "😻", "🙀", "🤖", "😷", "🤐", "😴", "🤮", "🥳"];
    const limboCards = [{id: 1, image: "/assets/key1.png"},
        {id: 1, image: "/assets/key2.png"},
        {id: 1, image: "/assets/key3.png"},
        {id: 1, image: "/assets/key4.png"},
        {id: 1, image: "/assets/key5.png"},
        {id: 1, image: "/assets/key6.png"},
        {id: 1, image: "/assets/key7.png"},
        {id: 1, image: "/assets/key8.png"}
    ]
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
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const [isShuffling, setIsShuffling] = useState(false);

    const cols = difficulty === "easy" ? 4 : difficulty === "medium" || difficulty === "limboesque" ? 4 : 8;
    const rows = difficulty === "easy" ? 2 : difficulty === "medium" || difficulty === "hard" || difficulty === "limboesque" ? 4 : 8;

    useEffect(() => {
        let paircount = difficulty === "easy" ? 4 : difficulty === "medium" || difficulty === "limboesque" ? 8 : difficulty === "hard" ? 16 : 32;
        let selected;
        if(difficulty === "limboesque"){
            selected = shuffle(limboCards).slice(0, paircount);
            const pairedCards = shuffle([
            ...selected.map(c => ({ ...c })),
            ...selected.map(c => ({ ...c }))
            ]);
            setShuffledCards(pairedCards);
        } else{
            selected = shuffle(cards).slice(0, paircount);
            const pairedCards = shuffle([...selected, ...selected]);
            setShuffledCards(pairedCards);
        }
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
    
    useEffect(() =>{
        if(difficulty !== "limboesque") return;

        const shuffleInterval = setInterval(() => {
            setIsShuffling(true);
            setTimeout(() => {
            setShuffledCards(prev => {
                const matched =  matchedCards.map(index => ({index, card: prev[index] }));
                const unmatched = prev
                    .map((card, index) => matchedCards.includes(index) || flippedCards.includes(index) ? null : {index, card})
                    .filter(Boolean);

                const shuffledUnmatched = shuffle(unmatched);

                const newCards = [...prev];
                const positions = unmatched.map(u => u.index);
                const shuffledCardsOnly = shuffle(unmatched.map(u => u.card));

                positions.forEach((pos,i) =>{
                    newCards[pos] = shuffledCardsOnly[i];
                });

                return newCards;
            });
            setIsShuffling(false);
            }, 500);
        }, 5000);

        return () => clearInterval(shuffleInterval);
    }, [difficulty, matchedCards]);

    useEffect(() =>{
        if(difficulty !== "limboesque") return;

        if(time >= 60){
            clearInterval(timerRef.current)
            alert("Time's up! I guess you're not as good as i thought");
            navigate("/");
        }
    }, [time])

    useEffect(() =>{
        if(difficulty === "limboesque"){
            audioRef.current = new Audio(limboMusic);
            audioRef.current.currentTime = 133;
            audioRef.current.play().catch(err => {
                console.log("Autoplay blocked, waiting for user interaction", err);
            });
        }
        return () => {
            if(audioRef.current){
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [difficulty]);

    useEffect(() => {
        if(pairsFound === movesNeeded()){
            clearInterval(timerRef.current);
            setGameOver(true);

            const results = JSON.parse(localStorage.getItem("leaderboard")) || [];
            results.push({
                name: localStorage.getItem("player_name") || "Unknown",
                time,
                moves,
                difficulty
            });
            localStorage.setItem("leaderboard", JSON.stringify(results));
        }
    }, [pairsFound]);

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
            if(
                (typeof shuffleCards[first] === "string" && shuffleCards[first] === shuffleCards[second]) ||
                (typeof shuffleCards[first] === "object" && shuffleCards[first].image === shuffleCards[second].image)
            ){
                const newMatched = [...matchedCards, first, second];
                setMatchedCards(newMatched);
                setPairsFound(prev => prev + 1);

                if(newMatched.length === movesNeeded()*2)
                    setTimeout(() => {
                    alert(`Nice, you found all the pairs! Time it took:${time} seconds, Moves: ${moves+1}`);
                    navigate("/");
                }, 500);
            }
            setTimeout(() => {
            setFlippedCards([]);
            }, 500);
        }
    }

    function movesNeeded(){
        return difficulty === "easy" ? 4 : difficulty === "medium" || difficulty === "limboesque" ? 8 : difficulty === "hard" ? 16 : 32;
    }

    return(
        <div className={`board ${difficulty === "expert" ? "zoom-out" : ""}`}>
            <div className={`game-stats ${difficulty === "expert" ? "expert-stats" : ""}`}>
                <span className="game-time">Time: {time} seconds</span>
                <span className="game-moves">Moves: {moves}</span>
                <span className="game-pairs">Pairs found: {pairsFound} / {movesNeeded()} </span>
            </div>
            <div className={`card-grid ${difficulty === "expert" ? "expert" : ""}`}
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${cols}, minmax(80px, 1fr))`,
                    gridTemplateRows: `repeat(${rows}, auto)`,
                    gap: "10px",
                }}>
                {shuffleCards.map((card, index) => (
                    <Card
                    key = {index}
                    emoji = {typeof card === "string" ? card : null }
                    image = {typeof card === "object" && card.image ? card.image : null}
                    isFlipped={isPreviewing || flippedCards.includes(index) || matchedCards.includes(index)}
                    onClick={() => handleCardClick(index)}
                    className = {isShuffling ? "shuffling" : ""}
                    />
                ))}
            </div>
            <button className="come_back" onClick={() => navigate("/")}> Go back</button>
        </div>
    )
}

export default Memory_game