
function Card({emoji, image, onClick, isFlipped, className}){
    return (
        <div className={`card ${isFlipped ? "flipped" : ""} ${className || ""}`} onClick={onClick}>
            {isFlipped ? (
                image ? (
                    <img src={image} alt="card" className="card-image" />
                ) : (
                    <span className="emoji">{emoji}</span>
                )
                ) : (
                    <div className="card-back" />
                )}
        </div>
    );
}

export default Card;