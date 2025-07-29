
function Card({emoji, onClick, isFlipped}){
    return (
        <div className="card" onClick={onClick}>
            {isFlipped ? emoji : "❓"}
        </div>
    );
}

export default Card;